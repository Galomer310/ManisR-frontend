// src/screens/Settings.tsx
import React from "react";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";

/**
 * Settings screen placeholder:
 * Displays user settings.
 */
const Settings: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="screen-container">
        <h2>Settings</h2>
        <p>Your settings options go here.</p>
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

export default Settings;
