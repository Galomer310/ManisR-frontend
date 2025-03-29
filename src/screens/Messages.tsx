// src/screens/Messages.tsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowRight } from "react-icons/fa";

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
  const navigate = useNavigate();
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  const localUserId = Number(localStorage.getItem("userId"));

  // If the otherPartyId is missing and role is "giver", use a fallback (for testing only).
  const receiverId =
    otherPartyId !== undefined && otherPartyId !== null
      ? otherPartyId
      : role === "giver"
      ? 9999 // Replace with a valid fallback id if needed.
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
    "👍 בסדר",
    "אני ממהר/ת, אודה להגעה בהקדם",
    "לצערי לא אוכל להתעכב ב5 דק' נוספות",
  ];
  const defaultMessages =
    role === "taker" ? defaultMessagesTaker : defaultMessagesGiver;

  const [conversation, setConversation] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
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

  const sendMessageHandler = async () => {
    if (!mealId) {
      alert("Conversation not found. Please try again later.");
      return;
    }
    if (newMessage.trim() === "") {
      alert("Please enter a message.");
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
          message: newMessage,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewMessage("");
      // Refresh messages after sending.
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
    // Use the default message as newMessage and send it.
    setNewMessage(msg);
    await sendMessageHandler();
  };

  return (
    <div className="screen-container">
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
        <FaArrowRight size={24} color="black" />
      </div>

      {!mealId ? (
        <p style={{ color: "red" }}>No conversation found for this meal.</p>
      ) : (
        <>
          <div className="chat-messages">
            {conversation.length === 0 ? (
              <p>No messages yet.</p>
            ) : (
              conversation.map((msg) => (
                <div className="messageText" key={msg.id}>
                  {msg.message}
                </div>
              ))
            )}
          </div>
          <div className="messageBtn">
            <p>בחר/י את ההודעות שברצונך לשלוח</p>
            {defaultMessages.map((msg, index) => (
              <button
                key={index}
                onClick={() => handleDefaultMessageClick(msg)}
              >
                {msg}
              </button>
            ))}
          </div>
        </>
      )}
      {error && (
        <p className="error" style={{ color: "red" }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default Messages;
