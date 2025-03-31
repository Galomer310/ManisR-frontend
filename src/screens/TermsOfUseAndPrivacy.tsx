// src/screens/TalkToUs.tsx
import React from "react";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";

/**
 * TalkToUs screen placeholder:
 * Displays contact information and a form.
 */
const TermsOfUseAndPrivacy: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="screen-container">
        <h2>תנאי שימוש ופרטיות</h2>
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

export default TermsOfUseAndPrivacy;
