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
  const [initiator, setInitiator] = useState(false);
  const [navigated, setNavigated] = useState(false);

  // 1) State from the navigation
  const { mealData, reservationStart } = location.state as {
    mealData: MealData;
    reservationStart: number;
  };

  const TOTAL_SECONDS = 30 * 60;
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  // Countdown timer effect
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

  // Polling effect: check every 5 seconds if the meal still exists.
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
          if (initiator) {
            setNavigated(true);
            navigate("/rate-review", { state: { mealData, reservationStart } });
          } else {
            setNavigated(true);
            navigate("/rate-review", {
              state: { mealData, reservationStart },
            });
          }
        }
      }
    };

    checkMeal();
    const intervalId = setInterval(checkMeal, 2000);
    return () => clearInterval(intervalId);
  }, [
    mealData?.id,
    API_BASE_URL,
    reservationStart,
    initiator,
    navigated,
    navigate,
  ]);

  // Giver chat button
  const handleChat = () => {
    if (!mealData?.id) return;
    navigate("/messages", {
      state: { mealId: mealData.id.toString(), role: "giver" },
    });
  };

  // When the giver clicks "המנה נאספה"
  const handleMealTaken = async () => {
    if (!mealData?.id) return;
    try {
      const token = localStorage.getItem("token");
      setInitiator(true);
      await axios.post(
        `${API_BASE_URL}/meal-history/archive/${mealData.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Do not navigate here; let polling take care of it.
    } catch (err) {
      console.error("Error archiving meal (giver):", err);
      alert("אירעה שגיאה בעת איסוף המנה.");
    }
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
