// src/screens/ReviewSuccess.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import basketIcon from "../assets/basket.svg";

const ReviewSuccess: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="screen-container review-success-container" dir="rtl">
      <h2>איזה כיף </h2>
      <p>הצלת מנה וצברת פרי לסל שלך</p>
      <img style={{ height: "20rem" }} src={basketIcon} />
      <button className="greenBtn" onClick={() => navigate("/menu")}>
        צפייה בפירות שצברתי
      </button>
    </div>
  );
};

export default ReviewSuccess;
