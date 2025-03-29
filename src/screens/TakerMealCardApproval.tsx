// src/screens/TakerMealCardApproval.tsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface MealData {
  id?: number;
  user_id?: number; // Giver's ID
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
  const { mealData, imageFile } = location.state as {
    mealData: MealData;
    imageFile?: File | null;
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

  // src/screens/TakerMealCardApproval.tsx (snippet)
  const handleSendMessage = async (defaultMsg: string) => {
    try {
      const token = localStorage.getItem("token");
      const takerId = Number(localStorage.getItem("userId"));
      // Ensure giverId is defined:
      const giverId = mealData.user_id;
      if (!mealData.id) {
        setError("Meal ID is missing.");
        return;
      }
      if (giverId == null) {
        setError("Giver ID is missing.");
        return;
      }
      const payload = {
        mealId: mealData.id,
        senderId: takerId,
        receiverId: giverId, // always include the giver's ID
        message: defaultMsg,
      };
      console.log("Sending message payload:", payload);
      const res = await fetch(`${API_BASE_URL}/meal-conversation`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || "Error sending message.");
        return;
      }
      // Navigate to the Messages screen, passing mealId and otherPartyId
      navigate("/messages", {
        state: {
          mealId: mealData.id.toString(),
          role: "taker",
          otherPartyId: giverId,
        },
      });
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Error sending message. Please try again.");
    }
  };

  const handleConnect = () => {
    handleSendMessage("I want to connect");
  };

  const handleQuestion = () => {
    handleSendMessage("I have a question");
  };

  return (
    <div className="screen-container" style={{ textAlign: "right" }}>
      <h2>Meal Details</h2>
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
          <p>No image available</p>
        )}
        <p>
          <strong>Meal Name:</strong> {mealData.item_description}
        </p>
        <p>
          <strong>Pickup Address:</strong> {mealData.pickup_address}
        </p>
        <p>
          <strong>Box Option:</strong>{" "}
          {mealData.box_option === "need" ? "Need" : "No Need"}
        </p>
        <p>
          <strong>Food Types:</strong> {mealData.food_types}
        </p>
        <p>
          <strong>Ingredients:</strong> {mealData.ingredients}
        </p>
        <p>
          <strong>Special Notes:</strong> {mealData.special_notes}
        </p>
      </div>
      {error && <p className="error">{error}</p>}
      <div style={{ display: "flex", gap: "1rem" }}>
        <button onClick={handleConnect}>I want to connect</button>
        <button onClick={handleQuestion}>I have a question</button>
      </div>
    </div>
  );
};

export default TakerMealCardApproval;
