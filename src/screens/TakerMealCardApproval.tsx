import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import locationIcon from "../assets/icons_ location.svg";
import { FaArrowRight } from "react-icons/fa";

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

  const handleSendMessage = async (defaultMsg: string) => {
    try {
      const token = localStorage.getItem("token");
      const takerId = Number(localStorage.getItem("userId"));
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
        receiverId: giverId,
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
      // Navigate to the Messages screen, passing mealId and otherPartyId (givers' id)
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
    <div
      className="screen-container GiverApprovalCard"
      style={{ textAlign: "right" }}
    >
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
        <FaArrowRight size={24} color="black" />
      </div>
      <div className="foodSummeryCardApproval">
        {imagePreviewUrl ? (
          <img src={imagePreviewUrl} alt="Meal Preview" />
        ) : (
          <p>אין תמונה להצגה</p>
        )}
        <p>
          <strong>{mealData.item_description}</strong>
        </p>
        <span>
          {mealData.pickup_address}
          <img src={locationIcon} style={{ height: "1rem", width: "1rem" }} />
        </span>
        <p>{mealData.ingredients}</p>
        <p>{mealData.food_types}</p>
        <p>
          <strong>צריך להביא קופסא:</strong>{" "}
          {mealData.box_option === "need" ? "כן" : "לא"}
        </p>

        <p>
          <strong>:הערות מיוחדות</strong>
        </p>
        <p>{mealData.special_notes}</p>
      </div>

      {error && <p className="error">{error}</p>}
      <div className="giverMealCardApproval">
        <button className="greenBtn" onClick={handleConnect}>
          אני רוצה לאסוף
        </button>
        <button className="whiteBtn" onClick={handleQuestion}>
          יש לי שאלה
        </button>
      </div>
    </div>
  );
};

export default TakerMealCardApproval;
