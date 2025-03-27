// src/screens/Messages.tsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

interface Message {
  senderId: number;
  message: string;
  created_at: string;
}

interface LocationState {
  conversationId: string;
  receiverId?: number;
  role?: string;
}

const Messages: React.FC = () => {
  const locationState = (useLocation().state || {}) as LocationState;
  const { conversationId, role = "" } = locationState;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const navigate = useNavigate();
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  const localUserId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API_BASE_URL}/meal-conversation/${conversationId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(
          res.data.conversation.map((msg: any) => ({
            senderId: msg.sender_id,
            message: msg.message,
            created_at: msg.created_at,
          }))
        );
      } catch (err) {
        console.error("Error fetching conversation:", err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [conversationId, API_BASE_URL]);

  const sendMessage = async () => {
    if (newMessage.trim() === "") {
      alert("Please enter a message.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/meal-conversation`,
        {
          mealId: Number(conversationId),
          senderId: localUserId,
          receiverId: 0, // You can update this if needed
          message: newMessage,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const res = await axios.get(
        `${API_BASE_URL}/meal-conversation/${conversationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(
        res.data.conversation.map((msg: any) => ({
          senderId: msg.sender_id,
          message: msg.message,
          created_at: msg.created_at,
        }))
      );
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="screen-container">
      {/* Back Button */}
      <div
        style={{
          position: "absolute",
          top: "1rem",
          left: "1rem",
          zIndex: 1100,
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            fontSize: "1.5rem",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          &gt;
        </button>
      </div>
      <h2 style={{ textAlign: "center", marginTop: "3rem" }}>Messages</h2>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.senderId === localUserId ? "You" : "Other"}:</strong>{" "}
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
          onClick={sendMessage}
          style={{ marginLeft: "0.5rem", padding: "0.5rem 1rem" }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Messages;
