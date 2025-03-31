// src/screens/Settings.tsx
import React, { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const handleToggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  return (
    <div className="screen-container settings-container">
      {/* Header row with title and back arrow */}
      <div className="settings-header">
        <h2>הגדרות</h2>
        <div className="back-icon" onClick={() => navigate(-1)}>
          <IoIosArrowForward size={24} color="black" />
        </div>
      </div>

      {/* Toggle row */}
      <div className="settings-item">
        <span>קבלת התראות</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={handleToggleNotifications}
          />
          <span className="slider round"></span>
        </label>
      </div>

      {/* Menu items */}
      <div
        className="settings-item"
        onClick={() => {
          // Navigate to Terms & Privacy screen if you have one
          console.log("Go to Terms & Privacy");
        }}
      >
        <span>תנאי שימוש ופרטיות</span>
        <IoIosArrowForward
          size={20}
          onClick={() => navigate("/Terms-Privacy")}
        />
      </div>

      <div
        className="settings-item"
        onClick={() => {
          // Navigate to Account Deletion screen if you have one
          console.log("Go to Account Deletion");
        }}
      >
        <span>מחיקת החשבון</span>
        <IoIosArrowForward size={20} />
      </div>
    </div>
  );
};

export default Settings;
