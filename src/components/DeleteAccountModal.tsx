// src/components/DeleteAccountModal.tsx
import React from "react";

interface DeleteAccountModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  show,
  onClose,
  onConfirm,
}) => {
  if (!show) return null; // don't render if not visible

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
        <h3 style={{ fontSize: "1.2rem" }}>? בטוח שבא לך למחוק את החשבון</h3>
        <p style={{ marginBottom: "1rem" }}>
          .מחיקת החשבון תמחק את החשבון לצמיתות
          <br />
          :) עדיין תוכלי/י לפתוח חשבון חדש בהמשך
        </p>
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

export default DeleteAccountModal;
