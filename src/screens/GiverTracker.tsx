// src/screens/GiverTracker.tsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import orangIcon from "../assets/orange tracker.svg";
import axios from "axios";

interface MealData {
  id?: number;
  item_description: string;
  pickup_address: string;
  avatar_url?: string;
  user_id?: number;
  taker_id?: number;
}

const GiverTracker: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [, setInitiator] = useState(false);
  const [navigated, setNavigated] = useState(false);
  // NEW: state to hold the archived meal's review record ID.
  const [archivedMealId, setArchivedMealId] = useState<number | null>(null);

  // State passed from navigation.
  const { mealData, reservationStart } = location.state as {
    mealData: MealData;
    reservationStart: number;
  };

  const TOTAL_SECONDS = 30 * 60;
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  // Countdown timer effect.
  useEffect(() => {
    const now = Date.now();
    const elapsedSec = Math.floor((now - reservationStart) / 1000);
    const remain = TOTAL_SECONDS - elapsedSec;
    setTimeLeft(remain > 0 ? remain : 0);

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [reservationStart]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // When the giver clicks "המנה נאספה"
  const handleMealTaken = async () => {
    if (!mealData?.id) return;
    try {
      const token = localStorage.getItem("token");
      setInitiator(true);
      // Call archiving endpoint; assume it returns { archivedMeal: { id: <newId>, ... } }
      const res = await axios.post(
        `${API_BASE_URL}/meal-history/archive/${mealData.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Save the new meal review record id.
      setArchivedMealId(res.data.archivedMeal.id);
    } catch (err) {
      console.error("Error archiving meal (giver):", err);
      alert("אירעה שגיאה בעת איסוף המנה.");
    }
  };

  // Polling: check every 2 seconds if the meal still exists.
  useEffect(() => {
    if (!mealData?.id) return;
    const checkMeal = async () => {
      try {
        const token = localStorage.getItem("token");
        await axios.get(`${API_BASE_URL}/food/${mealData.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err: any) {
        if (err.response && err.response.status === 404 && !navigated) {
          setNavigated(true);
          if (archivedMealId) {
            navigate("/rate-review", {
              state: {
                mealHistoryId: archivedMealId,
                mealData,
                reservationStart,
              },
            });
          } else {
            alert("Meal review record not found. Please try again.");
            navigate("/menu");
          }
        }
      }
    };

    // Run immediately and then every 2 seconds.
    checkMeal();
    const intervalId = setInterval(checkMeal, 2000);
    return () => clearInterval(intervalId);
  }, [
    mealData?.id,
    API_BASE_URL,
    reservationStart,
    navigated,
    navigate,
    archivedMealId,
  ]);

  // Giver chat button.
  const handleChat = () => {
    if (!mealData?.id) return;
    navigate("/messages", {
      state: { mealId: mealData.id?.toString(), role: "giver" },
    });
  };

  if (!mealData) {
    return <div>שגיאה: אין פרטי מנה.</div>;
  }

  return (
    <div className="screen-container giver-tracker">
      <div
        style={{
          position: "fixed",
          top: "1rem",
          right: "1rem",
          cursor: "pointer",
          zIndex: 1200,
        }}
        onClick={() => navigate(-1)}
      >
        <IoIosArrowForward size={24} color="black" />
      </div>
      <h2>ממתינים לאיסוף</h2>
      <h4>{mealData.item_description}</h4>
      <p>{mealData.pickup_address}</p>
      <div>
        <img src={orangIcon} alt="Orange Tracker Icon" />
      </div>
      <h3>זמן שנותר: {formatTime(timeLeft)}</h3>
      <button className="greenBtn" onClick={handleMealTaken}>
        המנה נאספה
      </button>
      <button className="whiteBtn" onClick={handleChat}>
        צ'אט
      </button>
    </div>
  );
};

export default GiverTracker;
