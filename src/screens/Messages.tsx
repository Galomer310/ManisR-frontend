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
  receiverId?: number; // initially passed receiver id (for taker)
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
  // For giver: resolvedReceiverId will store the taker id from the conversation messages
  const [resolvedReceiverId, setResolvedReceiverId] =
    useState<number>(receiverId);
  const navigate = useNavigate();
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  const localUserId = Number(localStorage.getItem("userId"));

  // Fetch conversation messages (and update resolvedReceiverId for giver)
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API_BASE_URL}/meal-conversation/${conversationId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const conv = res.data.conversation;
        setMessages(conv);

        // For giver, update resolvedReceiverId from conversation messages.
        if (role === "giver") {
          const takerMessage = conv.find(
            (msg: Message) => msg.senderId !== localUserId
          );
          if (takerMessage) {
            setResolvedReceiverId(takerMessage.senderId);
          } else {
            // If no taker message exists, set it to 0.
            setResolvedReceiverId(0);
          }
        }
      } catch (err) {
        console.error("Error fetching conversation:", err);
      }
    };

    fetchMessages();
    // Optionally, refresh messages every few seconds.
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [conversationId, API_BASE_URL, role, localUserId]);

  // Send a new message.
  const sendMessage = async () => {
    const userId = localUserId;
    let actualReceiverId = receiverId;
    if (role === "giver") {
      // For giver, use the resolved receiver id from the conversation messages.
      if (resolvedReceiverId === 0) {
        alert("No taker to send a message to yet.");
        return;
      }
      actualReceiverId = resolvedReceiverId;
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
          receiverId: actualReceiverId,
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
            <strong>{msg.senderId === localUserId ? "You" : "Other"}:</strong>{" "}
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
