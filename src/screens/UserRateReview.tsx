// src/screens/UserRateReview.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import grayLemon from "../assets/gray-lemon.svg";
import yellowLemon from "../assets/yellow-lemon.svg";

const UserRateReview: React.FC = () => {
  const navigate = useNavigate();
  // Expect mealHistoryId and mealData passed via location state
  const locationState = useLocation().state as {
    mealHistoryId?: number;
    mealData: any;
    reservationStart: number;
  };
  const { mealHistoryId, mealData } = locationState || {};

  // If mealHistoryId is not available, handle accordingly.
  useEffect(() => {
    if (!mealHistoryId) {
      alert("Meal review record not found. Please try again.");
      navigate("/menu");
    }
  }, [mealHistoryId, navigate]);

  // State for the two ratings (integers) and free-text review.
  const [userExperience, setUserExperience] = useState<number>(0);
  const [generalExperience, setGeneralExperience] = useState<number>(0);
  const [reviewText, setReviewText] = useState("");

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  // Called when user clicks the Approve button.
  const handleApprove = async () => {
    if (!mealHistoryId || !mealData) return;
    try {
      const token = localStorage.getItem("token");
      // In the new logic, we POST a new row to meal_reviews.
      // reviewer_id is the logged in user.
      const reviewer_id = Number(localStorage.getItem("userId"));
      // Optionally, you can set reviewee_id to the other party's id (e.g., mealData.user_id)
      const reviewPayload = {
        meal_id: mealData.id,
        reviewer_id,
        reviewee_id: mealData.user_id || null, // adjust as needed
        role: "giver", // or "taker" – set based on which user is reviewing
        user_review: userExperience,
        general_experience: generalExperience,
        comments: reviewText,
      };
      await axios.post(`${API_BASE_URL}/meal_reviews`, reviewPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Navigate to a success page.
      navigate("/review-success");
    } catch (error) {
      console.error("Error saving review:", error);
      alert("There was an error saving your review. Please try again.");
    }
  };

  // Function to render lemon rating icons.
  const renderRatingOptions = (
    selectedRating: number,
    setRating: (val: number) => void
  ) => {
    return (
      <div
        className="rating-options"
        style={{ display: "flex", gap: "1rem", justifyContent: "center" }}
      >
        {[1, 2, 3, 4, 5].map((value) => (
          <label key={value} style={{ cursor: "pointer" }}>
            <input
              type="radio"
              name="rating"
              value={value}
              style={{ display: "none" }}
              onChange={() => setRating(value)}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                src={value <= selectedRating ? yellowLemon : grayLemon}
                alt={`Rating ${value}`}
                style={{ width: "30px", height: "30px" }}
                onClick={() => setRating(value)}
              />
              <span>{value}</span>
            </div>
          </label>
        ))}
      </div>
    );
  };

  return (
    <div className="screen-container rate-review-container">
      {/* X icon at the top right */}
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

      <h2>? נו, איך היה </h2>
      <p>
        הדעה שלך עוזרת לנו לשמור על
        <br /> האפליקציה נעימה ובטוחה לשימוש
      </p>

      <div className="rating-section">
        <h3>ההתנהלות מול אוספ/ת המנה</h3>
        {renderRatingOptions(userExperience, setUserExperience)}
      </div>

      <div className="rating-section" style={{ marginTop: "1rem" }}>
        <h3>החוויה הכללית</h3>
        {renderRatingOptions(generalExperience, setGeneralExperience)}
      </div>

      <div className="review-section" style={{ marginTop: "1rem" }}>
        <h3>? יש משהו שהיית רוצה להוסיף</h3>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="...הערות והארות"
          rows={5}
          style={{ width: "100%", padding: "0.5rem" }}
        ></textarea>
      </div>

      <button
        className="greenBtn"
        onClick={handleApprove}
        style={{ marginTop: "1rem" }}
      >
        אישור
      </button>
    </div>
  );
};

export default UserRateReview;
