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
}

const GiverTracker: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Expect mealData and reservationStart passed via navigation state.
  const { mealData, reservationStart } = location.state as {
    mealData: MealData;
    reservationStart: number;
  };

  const TOTAL_SECONDS = 30 * 60;
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  // Start a countdown timer.
  useEffect(() => {
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

  // Archive the meal by calling the archive endpoint.
  const archiveMeal = async () => {
    if (!mealData?.id) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/meal-history/archive/${mealData.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Error archiving meal:", err);
      // Proceed even if archiving call errors.
    }
  };

  // Poll every 2 seconds to check if the meal has been removed from food_items.
  useEffect(() => {
    if (!mealData?.id) return;
    const intervalId = setInterval(async () => {
      try {
        const token = localStorage.getItem("token");
        // This GET should succeed while the meal is active.
        await axios.get(`${API_BASE_URL}/food/${mealData.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error: any) {
        // When GET returns 404, the meal is deleted from food_items.
        if (error.response && error.response.status === 404) {
          clearInterval(intervalId);
          // Archive the meal if not done already (if needed, you may call archiveMeal here).
          await archiveMeal();
          // Navigate to the review page using only the meal ID and the current user's ID.
          const userId = Number(localStorage.getItem("userId"));
          navigate("/rate-review", {
            state: { mealId: mealData.id, userId, role: "giver" },
          });
        }
      }
    }, 2000);
    return () => clearInterval(intervalId);
  }, [mealData?.id, API_BASE_URL, navigate]);

  // Optional manual trigger in case the user clicks "המנה נאספה".
  const handleMealTaken = async () => {
    await archiveMeal();
    const userId = Number(localStorage.getItem("userId"));
    navigate("/rate-review", {
      state: { mealId: mealData?.id, userId, role: "giver" },
    });
  };

  // Chat button navigates to the messages screen.
  const handleChat = () => {
    if (!mealData?.id) return;
    navigate("/messages", {
      state: { mealId: mealData.id.toString(), role: "giver" },
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
