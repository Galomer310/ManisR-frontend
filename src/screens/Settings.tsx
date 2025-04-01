// src/screens/Settings.tsx
import React, { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DeleteAccountModal from "../components/DeleteAccountModal";
const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleToggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  // Open the delete account confirmation modal.
  const handleShowDeleteModal = () => {
    setShowDeleteModal(true);
  };

  // Close the modal.
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  // When confirmed, call the backend to delete the user.
  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/users/delete`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // On success, clear localStorage and navigate to login.
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Error deleting account. Please try again.");
    } finally {
      setShowDeleteModal(false);
    }
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

      {/* Toggle notifications row */}
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

      {/* Terms & Privacy row */}
      <div
        className="settings-item"
        onClick={() => {
          navigate("/Terms-Privacy");
        }}
      >
        <span>תנאי שימוש ופרטיות</span>
        <IoIosArrowForward size={20} />
      </div>

      {/* Delete Account row */}
      <div
        className="settings-item"
        onClick={handleShowDeleteModal}
        style={{ color: "red" }}
      >
        <span>מחיקת החשבון</span>
        <IoIosArrowForward size={20} />
      </div>

      {/* Logout row */}
      <div
        className="settings-item-out"
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }}
      ></div>

      {/* DeleteAccountModal component */}
      <DeleteAccountModal
        show={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Settings;
