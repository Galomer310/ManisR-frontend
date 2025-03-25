// src/components/ChatRoom.tsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { io, Socket } from "socket.io-client";

interface Message {
  senderId: number;
  message: string;
  created_at: string;
}

let socket: Socket;

/**
 * ChatRoom component:
 * Joins a conversation room based on the logged‑in user and the giver.
 * It allows sending/receiving messages in real time.
 */
const ChatRoom: React.FC = () => {
  const location = useLocation();
  const { giverId } = location.state as { giverId: number };
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Initialize Socket.IO client using the API base URL from env
    socket = io(import.meta.env.VITE_API_BASE_URL || "http://localhost:3000");
    const userId = Number(localStorage.getItem("userId"));
    const conversationId = [userId, giverId].sort().join("-");
    socket.emit("joinConversation", { conversationId });
    socket.on("newMessage", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });
    return () => {
      socket.disconnect();
    };
  }, [giverId]);

  const sendMessage = () => {
    const userId = Number(localStorage.getItem("userId"));
    const conversationId = [userId, giverId].sort().join("-");
    const messagePayload = {
      conversationId,
      senderId: userId,
      message: newMessage,
    };
    socket.emit("sendMessage", messagePayload);
    setNewMessage("");
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
                : "Giver"}
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
    </div>
  );
};

export default ChatRoom;
