// src/screens/Messages.tsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  mealId?: string; // the meal's id will act as the conversation id
  role?: string;
}

const Messages: React.FC = () => {
  const locationState = (useLocation().state || {}) as LocationState;
  const { mealId } = locationState;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const navigate = useNavigate();
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  const localUserId = Number(localStorage.getItem("userId"));

  // If mealId is not provided, show an error message.
  useEffect(() => {
    if (!mealId) {
      console.error("No mealId provided in location state.");
    }
  }, [mealId]);

  const fetchMessages = async () => {
    if (!mealId) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API_BASE_URL}/meal-conversation/${mealId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages(res.data.conversation);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  useEffect(() => {
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
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/meal-conversation`,
        {
          mealId: mealId, // This is required by the backend
          senderId: localUserId,
          receiverId: 0, // Adjust this if you have a specific receiver id
          message: newMessage,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNewMessage("");
      fetchMessages();
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="screen-container">
      <h2>Messages</h2>
      {!mealId ? (
        <p style={{ color: "red" }}>No conversation found for this meal.</p>
      ) : (
        <>
          <div
            className="chat-messages"
            style={{
              border: "1px solid #ccc",
              padding: "8px",
              height: "300px",
              overflowY: "scroll",
            }}
          >
            {messages.map((msg) => (
              <div key={msg.id}>
                <strong>
                  {msg.sender_id === localUserId ? "You" : "Other"}:
                </strong>{" "}
                {msg.message}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", marginTop: "1rem" }}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              style={{ flexGrow: 1, padding: "0.5rem", fontSize: "1rem" }}
            />
            <button
              onClick={sendMessageHandler}
              style={{ marginLeft: "0.5rem", padding: "0.5rem 1rem" }}
            >
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Messages;
