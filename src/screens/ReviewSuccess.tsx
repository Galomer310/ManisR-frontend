// src/screens/ReviewSuccess.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

const ReviewSuccess: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="screen-container review-success-container" dir="rtl">
      <h2>כמה כיף!</h2>
      <p>שמירה מוצלחת: חסכת מנה וזכית בפרי לסל שלך!</p>
      <button onClick={() => navigate("/menu")}>מעבר לתפריט</button>
    </div>
  );
};

export default ReviewSuccess;
