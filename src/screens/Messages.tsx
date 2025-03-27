// Messages.tsx
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
  const location = useLocation();
  const {
    conversationId,
    receiverId = 0,
    role = "",
  } = location.state as LocationState;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const navigate = useNavigate();
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  // Fetch conversation messages when the component mounts.
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API_BASE_URL}/meal-conversation/${conversationId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(res.data.conversation);
      } catch (err) {
        console.error("Error fetching conversation:", err);
      }
    };
    fetchMessages();
  }, [conversationId, API_BASE_URL]);

  // Send a new message.
  const sendMessage = async () => {
    const userId = Number(localStorage.getItem("userId"));
    if (role === "giver" && receiverId === 0) {
      alert("No taker to send a message to yet.");
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
          mealId: conversationId,
          senderId: userId,
          receiverId, // use the provided receiverId
          message: newMessage,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh conversation messages after sending.
      const res = await axios.get(
        `${API_BASE_URL}/meal-conversation/${conversationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(res.data.conversation);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // Exit: Navigate back based on role.
  const exitMessages = () => {
    if (role === "giver") {
      navigate("/giver-meal-screen");
    } else if (role === "taker") {
      navigate("/collect-food");
    } else {
      navigate("/menu");
    }
  };

  return (
    <div className="screen-container">
      <h2>Messages</h2>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "8px",
          height: "300px",
          overflowY: "scroll",
        }}
      >
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>
              {msg.senderId === Number(localStorage.getItem("userId"))
                ? "You"
                : "Other"}
              :
            </strong>{" "}
            {msg.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage}>Send</button>
      <button onClick={exitMessages}>Exit</button>
    </div>
  );
};

export default Messages;
