// src/components/LogoutConfirmationModal.tsx
import React from "react";

interface LogoutConfirmationModalProps {
  show: boolean;
  onClose: () => void; // Called when user cancels (e.g. "לא, התחרטתי")
  onConfirm: () => void; // Called when user confirms (e.g. "כן")
}

const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({
  show,
  onClose,
  onConfirm,
}) => {
  if (!show) return null; // Don't render if the modal isn't visible.

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: "#FCFBF2",
          padding: "1rem",
          borderRadius: "25px",
          width: "80%",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <h3 style={{ fontSize: "1.2rem" }}>? בטוח שבא לך להתנתק</h3>
        <p style={{ marginBottom: "1rem" }}> :) תמיד נשמח לראות אותך שוב</p>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <button className="whiteBtn" onClick={onClose}>
            לא, התחרטתי
          </button>
          <button className="greenBtn" onClick={onConfirm}>
            כן
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmationModal;
