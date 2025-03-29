// src/screens/GiverTracker.tsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface MealData {
  id?: number;
  item_description: string;
  pickup_address: string;
  avatar_url?: string;
}

const GiverTracker: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Expect mealData to be passed in the location state
  const { mealData } = location.state as { mealData: MealData };

  // Timer state: 30 minutes (1800 seconds)
  const [timeLeft, setTimeLeft] = useState(1800);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Handler to navigate to chat view.
  const handleChat = () => {
    navigate("/messages", {
      state: { mealId: mealData.id?.toString(), role: "giver" },
    });
  };

  return (
    <div className="screen-container">
      <h2>Waiting for Pickup</h2>
      <div className="meal-details">
        <h3>{mealData.item_description}</h3>
        <p>{mealData.pickup_address}</p>
        {mealData.avatar_url ? (
          <img
            src={mealData.avatar_url}
            alt="Meal"
            style={{ width: "150px", height: "150px", borderRadius: "8px" }}
          />
        ) : (
          <div
            style={{ width: "150px", height: "150px", backgroundColor: "#eee" }}
          >
            No image available
          </div>
        )}
      </div>
      <div className="timer">
        <h3>Time Remaining: {formatTime(timeLeft)}</h3>
      </div>
      <div
        className="actions"
        style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}
      >
        <button onClick={handleChat}>Chat</button>
      </div>
    </div>
  );
};

export default GiverTracker;
