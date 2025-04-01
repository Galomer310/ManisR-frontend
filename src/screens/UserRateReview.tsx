// src/screens/UserRateReview.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import axios from "axios";

interface ReviewState {
  mealHistoryId?: number;
  userId?: number;
  role?: string; // "giver" or "taker"
}

const UserRateReview: React.FC = () => {
  const navigate = useNavigate();
  const locationState = useLocation().state as ReviewState;
  const { mealHistoryId, userId, role } = locationState || {};

  // Ensure required state is available.
  useEffect(() => {
    if (!mealHistoryId || !userId || !role) {
      alert("Meal review record not found. Please try again.");
      navigate("/menu");
    }
  }, [mealHistoryId, userId, role, navigate]);

  // Review states.
  const [userReview, setUserReview] = useState<number>(0);
  const [generalExperience, setGeneralExperience] = useState<number>(0);
  const [comments, setComments] = useState("");

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  // Submit the review using only the minimal required data.
  const handleApprove = async () => {
    if (!mealHistoryId || !userId || !role) return;
    try {
      const token = localStorage.getItem("token");
      const payload = {
        meal_id: mealHistoryId,
        reviewer_id: userId,
        role: role,
        user_review: userReview,
        general_experience: generalExperience,
        comments: comments,
      };
      await axios.post(`${API_BASE_URL}/meal_reviews`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/review-success");
    } catch (error) {
      console.error("Error saving review:", error);
      alert("Error saving review. Please try again.");
    }
  };

  return (
    <div className="screen-container rate-review-container">
      {/* Close button */}
      <div
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          cursor: "pointer",
          zIndex: 1000,
        }}
        onClick={() => navigate("/menu")}
      >
        <IoMdClose size={24} />
      </div>
      <h2>איך הייתה החוויה שלך?</h2>

      <div>
        <label>דירוג עצמי (1-5):</label>
        <input
          type="number"
          value={userReview}
          onChange={(e) => setUserReview(Number(e.target.value))}
          min="1"
          max="5"
        />
      </div>

      <div>
        <label>חוויה כללית (1-5):</label>
        <input
          type="number"
          value={generalExperience}
          onChange={(e) => setGeneralExperience(Number(e.target.value))}
          min="1"
          max="5"
        />
      </div>

      <div>
        <label>הערות:</label>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="הכנס כאן הערות והארות"
        ></textarea>
      </div>

      <button className="greenBtn" onClick={handleApprove}>
        אישור
      </button>
    </div>
  );
};

export default UserRateReview;
