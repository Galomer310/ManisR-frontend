// src/screens/TakerTracker.tsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import locationIcon from "../assets/location.png";
import orangIcon from "../assets/orange tracker.svg";
import axios from "axios";

interface MealData {
  id?: number;
  item_description: string;
  pickup_address: string;
  avatar_url?: string;
  user_id?: number;
}

/**
 * TakerTracker:
 * - Shows a 30-minute countdown after the Taker reserves the meal.
 * - Lets the Taker finalize collection ("אספתי את המנה") which calls the backend to:
 *   1) Delete the meal,
 *   2) Delete the conversation,
 *   3) Emit "mealCollected" for the Giver.
 */
const TakerTracker: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // We expect to receive `mealData` and `reservationStart` from location.state
  const { mealData, reservationStart } = location.state as {
    mealData: MealData;
    reservationStart: number;
  };

  // 30 minutes in seconds
  const TOTAL_SECONDS = 30 * 60;
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);

  // Base URL from your Vite environment or fallback
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  /**
   * Effect: calculates how many seconds have passed since `reservationStart`,
   * subtracts from 30 min, and starts a 1-second interval to decrement.
   */
  useEffect(() => {
    // Calculate how much time is left right now
    const now = Date.now();
    const elapsedMs = now - reservationStart;
    const elapsedSec = Math.floor(elapsedMs / 1000);
    const remain = TOTAL_SECONDS - elapsedSec;
    setTimeLeft(remain > 0 ? remain : 0);

    // Start a countdown timer
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

  /**
   * Helper to format mm:ss
   */
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  /**
   * Handler: Taker confirms they picked up the meal.
   * => calls `DELETE /food/collect/:mealId` to remove meal & conversation from DB,
   *    then navigates Taker to Menu (or a rating screen).
   */
  const handleMealTaken = async () => {
    if (!mealData?.id) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/food/collect/${mealData.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Once we successfully remove the meal, navigate Taker to Menu, or any other screen.
      navigate("/menu");
    } catch (err) {
      console.error("Error collecting meal:", err);
    }
  };

  /**
   * Handler: Taker wants to open the chat with the Giver.
   * Optionally, pass Giver's ID as `otherPartyId` if you have it.
   */
  const handleChat = () => {
    // mealData.user_id is the Giver’s ID
    if (!mealData?.id) return;
    navigate("/messages", {
      state: {
        mealId: mealData.id.toString(),
        role: "taker",
        otherPartyId: mealData.user_id, // The Giver’s ID
      },
    });
  };

  // If, for some reason, we didn't get a mealData
  if (!mealData) {
    return <div>אירעה שגיאה: לא נמצאו פרטי מנה.</div>;
  }

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
