// src/screens/TakerTracker.tsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import orangIcon from "../assets/orange tracker.svg";
import axios from "axios";

interface MealData {
  id?: number;
  item_description: string;
  pickup_address: string;
  status?: string;
}

const TakerTracker: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mealData, reservationStart } = location.state as {
    mealData: MealData;
    reservationStart: number;
  };

  const TOTAL_SECONDS = 30 * 60;
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

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

  const updateStatusToCollected = async () => {
    if (!mealData?.id) return;
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/food/status/${mealData.id}`,
        { status: "collected" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Error updating meal status:", err);
    }
  };

  const navigateToReview = () => {
    const userId = Number(localStorage.getItem("userId"));
    navigate("/rate-review", {
      state: { mealId: mealData?.id, userId, role: "taker" },
    });
  };

  const handleMealCollected = async () => {
    await updateStatusToCollected();
    navigateToReview();
  };

  useEffect(() => {
    if (!mealData?.id) return;
    const intervalId = setInterval(async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/food/${mealData.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.status && res.data.status === "collected") {
          clearInterval(intervalId);
          navigateToReview();
        }
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          clearInterval(intervalId);
          navigateToReview();
        }
      }
    }, 10000);
    return () => clearInterval(intervalId);
  }, [mealData?.id, API_BASE_URL, navigate]);

  const handleChat = () => {
    if (!mealData?.id) return;
    navigate("/messages", {
      state: { mealId: mealData.id.toString(), role: "taker" },
    });
  };

  if (!mealData) return <div>שגיאה: אין פרטי מנה.</div>;

  return (
    <div className="screen-container taker-tracker">
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
      <h2>את/ה בדרך לאיסוף</h2>
      <h4>{mealData.item_description}</h4>
      <p>{mealData.pickup_address}</p>
      <div>
        <img src={orangIcon} alt="Orange Tracker Icon" />
      </div>
      <h3>זמן שנותר: {formatTime(timeLeft)}</h3>
      <button className="greenBtn" onClick={handleMealCollected}>
        אספתי את המנה
      </button>
      <button className="whiteBtn" onClick={handleChat}>
        צ'אט
      </button>
    </div>
  );
};

export default TakerTracker;
