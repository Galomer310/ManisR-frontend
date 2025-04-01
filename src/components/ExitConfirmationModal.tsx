import React from "react";

interface ExitConfirmationModalProps {
  show: boolean;
  onClose: () => void; // Called when user cancels (לא, אדרג עכשיו)
  onConfirm: () => void; // Called when user confirms (כן, אדרג בהמשך)
}

const ExitConfirmationModal: React.FC<ExitConfirmationModalProps> = ({
  show,
  onClose,
  onConfirm,
}) => {
  if (!show) return null; // Don't render if the modal isn't visible

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
        <h3 style={{ fontSize: "1.2rem" }}>בטוח/ה שבא לך לסגור את הדירוג?</h3>
        <p style={{ marginBottom: "1rem" }}>
          אם לא תדרג/י את החוויה, לא תוכלי/י לצבור
          <br />
          פרי ולממש אותו לשוברים.
          <br />
          שימו לב: ניתן לדרג בהמשך.
        </p>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <button
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #ccc",
              borderRadius: "25px",
              padding: "0.5rem 1rem",
              cursor: "pointer",
            }}
            onClick={onClose}
          >
            לא, אדרג עכשיו
          </button>
          <button
            style={{
              backgroundColor: "#64C964",
              color: "#fff",
              border: "none",
              borderRadius: "25px",
              padding: "0.5rem 1rem",
              cursor: "pointer",
            }}
            onClick={onConfirm}
          >
            כן, אדרג בהמשך
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExitConfirmationModal;
