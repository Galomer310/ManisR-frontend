// src/screens/TakerTracker.tsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import locationIcon from "../assets/location.png";
import orangIcon from "../assets/orange tracker.svg";

interface MealData {
  id?: number;
  item_description: string;
  pickup_address: string;
  avatar_url?: string;
}

const TakerTracker: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Expect mealData to be passed in the location state
  const { mealData } = location.state as { mealData: MealData };

  // Timer state: 30 minutes in seconds (30 * 60 = 1800)
  const [timeLeft, setTimeLeft] = useState(1800);

  // Start a countdown timer that decrements every second.
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

  // Format seconds into mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Handler when the taker confirms that he took the meal.
  const handleMealTaken = () => {
    // (Place any logic to notify the backend if needed.)
    alert("Thank you for confirming that you took the meal.");
    // Navigate back to a main page or dashboard.
    navigate("/menu");
  };

  // Handler to navigate to the chat view.
  const handleChat = () => {
    navigate("/messages", {
      state: { mealId: mealData.id?.toString(), role: "taker" },
    });
  };

  return (
    <div className="screen-container tracker-container">
      <h2>את/ה בדרך לאסוף</h2>
      <div className="meal-details">
        <h3>{mealData.item_description}</h3>
        <span>
          {mealData.pickup_address}
          <img style={{ height: "1rem" }} src={locationIcon} />
        </span>
        <div>
          {" "}
          <img src={orangIcon} />
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
