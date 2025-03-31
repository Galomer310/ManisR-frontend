import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
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

/**
 * GiverTracker:
 * - Shows the same 30-minute countdown as Taker, based on the same reservationStart.
 * - Listens for "mealCollected" event via Socket.IO in real-time.
 *   => If the Taker collects (deletes) the meal, Giver sees it instantly.
 * - Provides a "המנה נאספה" button so the Giver can also delete the meal & conversation.
 * - Giver can also open chat if desired.
 */
const GiverTracker: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 1) State from the navigation
  const { mealData, reservationStart } = location.state as {
    mealData: MealData;
    reservationStart: number;
  };

  // 30 min in seconds
  const TOTAL_SECONDS = 30 * 60;
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  // If Taker collects meal, we'll set this to true to trigger UI changes
  const [collected, setCollected] = useState(false);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  const localUserId = Number(localStorage.getItem("userId"));

  const socket = io(API_BASE_URL, {
    transports: ["websocket"],
    autoConnect: false,
  });

  // 2) Start a countdown timer
  useEffect(() => {
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

  // 3) Format mm:ss
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("GiverTracker: connected to socket", socket.id);
    });

    socket.on("mealCollected", (payload: any) => {
      if (payload.giverId === localUserId && payload.mealId === mealData.id) {
        setCollected(true);
      }
    });

    socket.on("disconnect", () => {
      console.log("GiverTracker: disconnected from socket");
    });

    return () => {
      socket.off("connect");
      socket.off("mealCollected");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, [socket, localUserId, mealData.id]);

  // If meal is collected => show a message or navigate
  useEffect(() => {
    if (collected) {
      alert("המנה נאספה בהצלחה על ידי האוסף. תודה!");
      navigate("/rate-review");
    }
  }, [collected, navigate]);

  //  Giver can open chat
  const handleChat = () => {
    if (!mealData?.id) return;
    navigate("/messages", {
      state: {
        mealId: mealData.id.toString(),
        role: "giver",
      },
    });
  };

  const handleMealTaken = async () => {
    if (!mealData?.id) return;
    try {
      const token = localStorage.getItem("token");
      // Archive the meal: store its details in meal_history and delete it from food_items.
      await axios.post(
        `${API_BASE_URL}/meal-history/archive/${mealData.id}`,
        {}, // no extra payload needed
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // After successful archiving, navigate to the review screen.
      navigate("/rate-review", {
        state: { mealData, reservationStart },
      });
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
      {/* Clickable Back Icon at Top Right */}
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

      {/* 
        If the Giver wants to forcibly remove the meal, 
        they can click "המנה נאספה" 
      */}
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
