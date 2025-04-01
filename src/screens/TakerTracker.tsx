// src/screens/TakerTracker.tsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import locationIcon from "../assets/icons_ location.svg";
import orangIcon from "../assets/orange tracker.svg";
import axios from "axios";
import { IoIosArrowForward } from "react-icons/io";

interface MealData {
  id?: number;
  item_description: string;
  pickup_address: string;
  avatar_url?: string;
  user_id?: number;
}

const TakerTracker: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [navigated, setNavigated] = useState(false);
  // NEW: State to store archived meal review record id.
  const [archivedMealId, setArchivedMealId] = useState<number | null>(null);

  const { mealData, reservationStart } = location.state as {
    mealData: MealData;
    reservationStart: number;
  };

  const TOTAL_SECONDS = 30 * 60;
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    const now = Date.now();
    const elapsedMs = now - reservationStart;
    const elapsedSec = Math.floor(elapsedMs / 1000);
    const remain = TOTAL_SECONDS - elapsedSec;
    setTimeLeft(remain > 0 ? remain : 0);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [reservationStart]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleMealTaken = async () => {
    if (!mealData?.id) return;
    try {
      const token = localStorage.getItem("token");
      // Call the archive endpoint and set the archivedMealId state.
      const res = await axios.post(
        `${API_BASE_URL}/meal-history/archive/${mealData.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setArchivedMealId(res.data.archivedMeal.id);
    } catch (err) {
      console.error("Error archiving meal (taker):", err);
      alert("אירעה שגיאה בעת איסוף המנה.");
    }
  };

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

  const handleChat = () => {
    if (!mealData?.id) return;
    navigate("/messages", {
      state: {
        mealId: mealData.id?.toString(),
        role: "taker",
        otherPartyId: mealData.user_id,
      },
    });
  };

  if (!mealData) {
    return <div>אירעה שגיאה: לא נמצאו פרטי מנה.</div>;
  }

  return (
    <div className="screen-container tracker-container">
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
      <h2>את/ה בדרך לאסוף</h2>
      <div className="meal-details">
        <h3>{mealData.item_description}</h3>
        <span>
          {mealData.pickup_address}
          <img style={{ height: "1rem" }} src={locationIcon} alt="location" />
        </span>
        <div>
          <img src={orangIcon} alt="Orange Icon" />
        </div>
      </div>
      <div className="timer">
        <h3>נותרו עוד</h3>
        <h2>{formatTime(timeLeft)}</h2>
        <h3>לאיסוף המנה</h3>
      </div>
      <div className="trackerBtn">
        <button className="greenBtn" onClick={handleMealTaken}>
          אספתי את המנה
        </button>
        <button className="whiteBtn" onClick={handleChat}>
          צ'אט
        </button>
      </div>
    </div>
  );
};

export default TakerTracker;
