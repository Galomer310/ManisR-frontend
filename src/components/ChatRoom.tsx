// src/components/ChatRoom.tsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";

interface Message {
  senderId: number;
  message: string;
  created_at: string;
}

let socket: Socket;

const ChatRoom: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Expect receiverId and role to be passed in router state
  const { receiverId, role } =
    (location.state as { receiverId?: number; role?: string }) || {};

  if (!receiverId) {
    return (
      <div className="screen-container">
        <p className="error">Receiver ID is missing. Cannot start chat.</p>
      </div>
    );
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const backendURL =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
    socket = io(backendURL, { transports: ["websocket"] });
    const userId = Number(localStorage.getItem("userId"));
    const conversationId = [userId, receiverId].sort().join("-");
    socket.emit("joinConversation", { conversationId });
    socket.on("newMessage", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });
    return () => {
      socket.disconnect();
    };
  }, [receiverId]);

  const sendMessage = () => {
    if (!socket) return;
    const userId = Number(localStorage.getItem("userId"));
    const conversationId = [userId, receiverId].sort().join("-");
    const messagePayload = {
      conversationId,
      senderId: userId,
      message: newMessage,
    };
    socket.emit("sendMessage", messagePayload);
    setNewMessage("");
  };

  // Exit chat button navigates based on role
  const exitChat = () => {
    if (role === "taker") {
      navigate("/collect-food");
    } else {
      navigate("/giver-meal-screen");
    }
  };

  return (
    <div className="screen-container">
      <h2>Chat Room</h2>
      <div
        className="chat-messages"
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
                : "Them"}
              :
            </strong>{" "}
            {msg.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type your message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
      <button onClick={exitChat}>Exit Chat</button>
    </div>
  );
};

export default ChatRoom;
