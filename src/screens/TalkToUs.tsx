// src/screens/TalkToUs.tsx
import React from "react";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";

/**
 * TalkToUs screen placeholder:
 * Displays contact information and a form.
 */
const TalkToUs: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="screen-container">
        <h2>דבר איתנו</h2>
        <p>
          .אנחנו תמיד שמחים לעזור מלא/י את הטופס ונחזיר הודעה באמצעות הדוא"ל
          בהקדם
        </p>
        <p>need to do !!!</p>
      </div>

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
        <IoIosArrowForward size={24} color="black" />
      </div>
    </div>
  );
};

export default TalkToUs;
