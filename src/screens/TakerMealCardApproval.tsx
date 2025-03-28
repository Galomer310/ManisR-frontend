// src/screens/TakerMealCardApproval.tsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface MealData {
  id?: number;
  item_description: string;
  pickup_address: string;
  box_option: "need" | "noNeed";
  food_types: string;
  ingredients: string;
  special_notes: string;
}

const TakerMealCardApproval: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Expecting state: mealData, imageFile (optional), and role (should be "taker")
  const {
    mealData,
    imageFile,
    role = "taker",
  } = location.state as {
    mealData: MealData;
    imageFile?: File | null;
    role?: string;
  };

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    if (imageFile) {
      const objectUrl = URL.createObjectURL(imageFile);
      setImagePreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [imageFile]);

  // For "I want to collect" button:
  const handleCollect = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = Number(localStorage.getItem("userId"));
      const defaultMessage = "I want to collect";
      await fetch(`${API_BASE_URL}/meal-conversation`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mealId: mealData.id,
          senderId: userId,
          receiverId: 0, // Update this if you have the giver's id available.
          message: defaultMessage,
        }),
      });
      navigate("/messages", {
        state: { conversationId: mealData.id?.toString(), role: "taker" },
      });
    } catch (err) {
      console.error("Error processing collect action:", err);
    }
  };

  // For "I have a question" button:
  const handleQuestion = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = Number(localStorage.getItem("userId"));
      const defaultMessage = "I have a question";
      await fetch(`${API_BASE_URL}/meal-conversation`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mealId: mealData.id,
          senderId: userId,
          receiverId: 0, // Update if available.
          message: defaultMessage,
        }),
      });
      navigate("/messages", {
        state: { conversationId: mealData.id?.toString(), role: "taker" },
      });
    } catch (err) {
      console.error("Error processing question action:", err);
    }
  };

  return (
    <div
      className="screen-container"
      style={{ textAlign: "right", position: "relative" }}
    >
      {/* Back Button */}
      <div
        style={{
          position: "absolute",
          top: "1rem",
          left: "1rem",
          zIndex: 1100,
        }}
      >
        <a
          onClick={() => navigate(-1)}
          style={{
            fontSize: "1.5rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "right",
          }}
        >
          &gt;
        </a>
      </div>
      <h2 style={{ textAlign: "center", marginTop: "3rem" }}>Meal Details</h2>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        {imagePreviewUrl ? (
          <img
            src={imagePreviewUrl}
            alt="Meal Preview"
            style={{ width: "100%", maxWidth: "300px", marginBottom: "1rem" }}
          />
        ) : (
          <p>אין תמונה להצגה</p>
        )}
        <p>
          <strong>שם המנה:</strong> {mealData.item_description}
        </p>
        <p>
          <strong>כתובת לאיסוף:</strong> {mealData.pickup_address}
        </p>
        <p>
          <strong>צריך להביא קופסא:</strong>{" "}
          {mealData.box_option === "need" ? "כן" : "לא"}
        </p>
        <p>
          <strong>סוגי אוכל:</strong> {mealData.food_types}
        </p>
        <p>
          <strong>מרכיבים:</strong> {mealData.ingredients}
        </p>
        <p>
          <strong>הערות מיוחדות:</strong> {mealData.special_notes}
        </p>
      </div>
      {error && <p className="error">{error}</p>}
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
        <button onClick={handleCollect}>I want to collect</button>
        <button onClick={handleQuestion}>I have a question</button>
      </div>
    </div>
  );
};

export default TakerMealCardApproval;
