// src/screens/Messages.tsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

interface Message {
  id: number;
  meal_id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  created_at: string;
}

interface LocationState {
  mealId?: string;
  role: string; // "taker" or "giver"
  otherPartyId?: number; // For taker: giver's id; for giver: taker's id.
}

const Messages: React.FC = () => {
  const locationState = (useLocation().state || {}) as LocationState;
  const { mealId, role, otherPartyId } = locationState;
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  const localUserId = Number(localStorage.getItem("userId"));

  // If the otherPartyId is missing and role is "giver", use a fallback (for testing only).
  const receiverId =
    otherPartyId !== undefined && otherPartyId !== null
      ? otherPartyId
      : role === "giver"
      ? 9999 // <-- Replace 9999 with a valid fallback taker id for testing, or ensure your navigation state supplies this
      : undefined;

  // Default messages: six for taker, seven for giver.
  const defaultMessagesTaker = [
    "אני בדרך לאסוף",
    "אני צריך/ה עוד 5 ד'ק בבקשה",
    "אני נאלץ/ץ לבטל הגעה, מתנצל/ת",
    "הגעתי",
    "הגעתי ואני לא מוצא/ת את המנה",
    "המנה אצלי, תודה רבה",
  ];
  const defaultMessagesGiver = [
    "המנה ממתינה לך בכתובת שצוינה",
    "המנה נמצאת מחוץ לדלת בכתובת שצוינה",
    "לא לשכוח להביא קופסא לאיסוף בבקשה",
    "שולח/ת צילום של המיקום בו מונחת המנה",
    "בסדר",
    "אני ממהר/ת, אודה להגעה בהקדם",
    "לצערי לא אוכל להתעכב ב5 דק' נוספות",
  ];
  const defaultMessages =
    role === "taker" ? defaultMessagesTaker : defaultMessagesGiver;

  const [conversation, setConversation] = useState<Message[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!mealId) {
      console.error("No mealId provided in location state.");
      return;
    }
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API_BASE_URL}/meal-conversation/${mealId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setConversation(res.data.conversation);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [mealId, API_BASE_URL]);

  const sendMessage = async (msgText: string) => {
    if (!mealId) {
      alert("Conversation not found. Please try again later.");
      return;
    }
    if (receiverId === undefined) {
      alert("Other party's ID is missing. Please try again.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/meal-conversation`,
        {
          mealId: Number(mealId),
          senderId: localUserId,
          receiverId: receiverId,
          message: msgText,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh conversation
      const res = await axios.get(
        `${API_BASE_URL}/meal-conversation/${mealId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setConversation(res.data.conversation);
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Error sending message. Please try again.");
    }
  };

  const handleDefaultMessageClick = async (msg: string) => {
    await sendMessage(msg);
  };

  return (
    <div className="screen-container">
      <h2>Default Messages</h2>
      {error && (
        <p className="error" style={{ color: "red" }}>
          {error}
        </p>
      )}
      {/* If otherPartyId is still missing, show a warning */}
      {receiverId === undefined && (
        <p style={{ color: "red" }}>
          Warning: Other party's ID is missing. Please ensure that the
          navigation state includes a valid ID.
        </p>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {defaultMessages.map((msg, index) => (
          <button
            key={index}
            onClick={() => handleDefaultMessageClick(msg)}
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              backgroundColor: "#f0f0f0",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            {msg}
          </button>
        ))}
      </div>
      <h3 style={{ marginTop: "2rem" }}>Conversation</h3>
      <div
        className="chat-messages"
        style={{
          border: "1px solid #ccc",
          padding: "8px",
          height: "300px",
          overflowY: "scroll",
          marginTop: "1rem",
        }}
      >
        {conversation.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          conversation.map((msg) => (
            <div key={msg.id}>
              <strong>
                {msg.sender_id === localUserId ? "You" : "Other"}:
              </strong>{" "}
              {msg.message}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Messages;
