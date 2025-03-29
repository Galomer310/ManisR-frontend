import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

interface Message {
  senderId: number;
  message: string;
  created_at: string;
}

const ChatRoom: React.FC = () => {
  const location = useLocation();
  // conversationId is the meal id (as a string) used to identify the conversation
  const { conversationId } = location.state as { conversationId: string };
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const navigate = useNavigate();
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  // Fetch conversation messages when component mounts.
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API_BASE_URL}/meal_conversation/${conversationId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMessages(res.data.conversation);
      } catch (err) {
        console.error("Error fetching conversation:", err);
      }
    };
    fetchMessages();
  }, [conversationId, API_BASE_URL]);

  // Function to send a new message.
  const sendMessage = async () => {
    const userId = Number(localStorage.getItem("userId"));
    const { giverId } = location.state;
    const receiverId = giverId;
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/meal_conversation`,
        {
          mealId: conversationId,
          senderId: userId,
          receiverId: receiverId,
          message: newMessage,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh conversation messages
      const res = await axios.get(
        `${API_BASE_URL}/meal_conversation/${conversationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages(res.data.conversation);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // Exit chat and navigate back.
  const exitChat = () => {
    navigate("/menu");
  };

  return (
    <div className="screen-container">
      <h2>Chat Room</h2>
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
      <button onClick={exitChat}>Exit Chat</button>
    </div>
  );
};

export default ChatRoom;
