// src/screens/GiverTracker.tsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

interface MealData {
  id?: number;
  item_description: string;
  pickup_address: string;
  avatar_url?: string;
}
/**
 * GiverTracker:
 * - Shows the same 30-minute countdown as Taker, based on the same reservationStart.
 * - Listens for a "mealCollected" event via Socket.IO in real-time.
 *   => If the Taker collects (deletes) the meal, Giver sees it instantly.
 * - Giver can also open chat if desired.
 */
const GiverTracker: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // We expect the entire mealData + reservationStart in location.state
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

  /**
   * 1) Start countdown
   */
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

  /**
   * 2) Format mm:ss
   */
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  /**
   * 3) Socket: if Taker collects meal => backend does `io.emit("mealCollected")`
   *    => Giver receives that event in real time
   */
  const socket = io(API_BASE_URL, {
    transports: ["websocket"],
    autoConnect: false,
  });
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("GiverTracker: connected to socket", socket.id);
    });

    // Listen for "mealCollected"
    socket.on("mealCollected", (payload: any) => {
      console.log("GiverTracker: got mealCollected event:", payload);
      // payload => { mealId, giverId, takerId }
      // If this is MY meal (giverId === localUserId) and same meal ID => set collected
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

  /**
   * 4) If meal is collected, we can show a message or navigate away
   */
  useEffect(() => {
    if (collected) {
      // e.g. show an alert or navigate to menu / rating screen
      alert("המנה נאספה בהצלחה על ידי האוסף. תודה!");
      navigate("/menu");
    }
  }, [collected, navigate]);

  /**
   * 5) Giver can open chat if desired
   */
  const handleChat = () => {
    if (!mealData?.id) return;
    navigate("/messages", {
      state: {
        mealId: mealData.id.toString(),
        role: "giver",
        // otherPartyId: ??? if you store Taker's ID
      },
    });
  };

  if (!mealData) {
    return <div>שגיאה: אין פרטי מנה.</div>;
  }

  return (
    <div className="screen-container">
      <h2>ממתינים לאיסוף</h2>
      <div className="meal-details">
        <h4>{mealData.item_description}</h4>
        <p>{mealData.pickup_address}</p>
      </div>

      <h3>זמן שנותר: {formatTime(timeLeft)}</h3>

      <div style={{ marginTop: "1rem" }}>
        <button onClick={handleChat}>צ'אט</button>
      </div>
    </div>
  );
};

export default GiverTracker;
