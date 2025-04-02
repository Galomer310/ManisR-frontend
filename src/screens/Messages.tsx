// src/screens/Messages.tsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { IoIosArrowForward } from "react-icons/io";

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
  otherPartyId?: number; // Taker: Giver’s ID, Giver: Taker’s ID
}

// Define a simple User interface for the profile info we want to show.
interface User {
  name: string;
  username: string;
  avatar_url?: string;
}

const Messages: React.FC = () => {
  const locationState = (useLocation().state || {}) as LocationState;
  const { mealId, role, otherPartyId } = locationState;
  const navigate = useNavigate();
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  const localUserId = Number(localStorage.getItem("userId"));

  // We'll keep our real "otherPartyId" in a local state variable
  // so we can overwrite it if the Giver tries to open messages
  // with no known Taker yet.
  const [actualOtherPartyId, setActualOtherPartyId] = useState<number | null>(
    otherPartyId || null
  );

  const [conversation, setConversation] = useState<Message[]>([]);
  const [, setNewMessage] = useState("");
  const [error, setError] = useState("");
  const [userProfile, setUserProfile] = useState<User | null>(null);

  // Load user profile from localStorage on mount.
  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const userObj: User = JSON.parse(userString);
        setUserProfile(userObj);
      } catch (err) {
        console.error("Error parsing user data", err);
      }
    }
  }, []);

  // Fetch conversation on mount & every 5 seconds.
  useEffect(() => {
    if (!mealId) {
      console.error("No mealId provided in location state.");
      return;
    }
    const token = localStorage.getItem("token");

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/meal-conversation/${mealId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const convData = res.data.conversation as Message[];
        setConversation(convData);

        // If we are the "giver" and we do NOT yet have a known otherPartyId,
        // try to find the Taker's ID from the conversation.
        if (role === "giver" && !actualOtherPartyId && convData.length > 0) {
          const messageFromSomeoneElse = convData.find(
            (msg) => msg.sender_id !== localUserId
          );
          if (messageFromSomeoneElse) {
            setActualOtherPartyId(messageFromSomeoneElse.sender_id);
          }
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [mealId, API_BASE_URL, role, actualOtherPartyId, localUserId]);

  // Refactored send message handler that accepts a message as parameter.
  const sendMessageHandler = async (msg: string) => {
    if (!mealId) {
      alert("Conversation not found. Please try again later.");
      return;
    }
    if (msg.trim() === "") {
      // For manual sending, you may still want to alert.
      alert("Please enter a message.");
      return;
    }
    if (!actualOtherPartyId) {
      alert("The other party's ID is missing. Please try again.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/meal-conversation`,
        {
          mealId: Number(mealId),
          senderId: localUserId,
          receiverId: actualOtherPartyId,
          message: msg,
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

  // For preset/default messages.
  const handleDefaultMessageClick = async (msg: string) => {
    await sendMessageHandler(msg);
  };

  return (
    <div className="screen-container messages-container">
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

      <div className="message-input-section">
        <div className="ChatProfileImg">
          <div className="ChatTextProfileImgSection">
            <p>{userProfile?.name || "User Name"}</p>
            <p>מחובר/ת</p>
          </div>
          <img
            src={
              userProfile?.avatar_url ||
              "https://via.placeholder.com/40?text=Avatar"
            }
            alt="User Avatar"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        </div>
      </div>

      {!mealId ? (
        <p style={{ color: "red" }}>No conversation found for this meal.</p>
      ) : (
        <>
          {/* Conversation */}
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

          {/* Default message buttons */}
          <div className="messageBtn">
            <p>בחר/י את ההודעות שברצונך לשלוח</p>
            {role === "taker"
              ? [
                  "אני בדרך לאסוף",
                  "אני צריך/ה עוד 5 ד'ק בבקשה",
                  "אני נאלץ/ת לבטל הגעה, מתנצל/ת",
                  "הגעתי",
                  "הגעתי ואני לא מוצא/ת את המנה",
                  "המנה אצלי, תודה רבה",
                ].map((msg, index) => (
                  <button
                    key={index}
                    onClick={() => handleDefaultMessageClick(msg)}
                  >
                    {msg}
                  </button>
                ))
              : [
                  "המנה ממתינה לך בכתובת שצוינה",
                  "המנה נמצאת מחוץ לדלת בכתובת שצוינה",
                  "לא לשכוח להביא קופסא לאיסוף בבקשה",
                  "שולח/ת צילום של המיקום בו מונחת המנה",
                  "👍 בסדר",
                  "אני ממהר/ת, אודה להגעה בהקדם",
                  "לצערי לא אוכל להתעכב ב5 דק' נוספות",
                ].map((msg, index) => (
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
