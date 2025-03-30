// src/screens/UserRateReview.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import grayLemon from "../assets/gray-lemon.svg";
import yellowLemon from "../assets/yellow-lemon.svg";

const UserRateReview: React.FC = () => {
  const navigate = useNavigate();
  // State for the two ratings and free-text review.
  const [userExperience, setUserExperience] = useState<number>(0);
  const [generalExperience, setGeneralExperience] = useState<number>(0);
  const [reviewText, setReviewText] = useState("");

  // Called when user clicks the Approve button.
  const handleApprove = () => {
    // Optionally: send rating data to your backend API here.
    // For now, just navigate to the menu.
    navigate("/menu");
  };

  // Function to render lemon rating icons.
  // Helper to render a set of lemon rating options with numbers.
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
            {/* Hidden radio input for accessibility */}
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
