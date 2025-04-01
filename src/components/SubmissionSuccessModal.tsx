import React from "react";
import { IoMdClose } from "react-icons/io";

interface SubmissionSuccessModalProps {
  show: boolean;
  onClose: () => void;
}

const SubmissionSuccessModal: React.FC<SubmissionSuccessModalProps> = ({
  show,
  onClose,
}) => {
  if (!show) return null; // Don't render if not visible

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
          position: "relative",
        }}
      >
        {/* Close Icon */}
        <div
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            cursor: "pointer",
          }}
          onClick={onClose}
        >
          <IoMdClose size={24} />
        </div>

        <h2
          style={{
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
            fontSize: "1.2rem",
            margin: "2rem 0 1rem",
          }}
        >
          ! הפניה שלך התקבלה בהצלחה
        </h2>
        <p style={{ marginBottom: "1rem" }}>
          .ניצור קשר באמצעות הדוא״ל בימים הקרובים
        </p>
      </div>
    </div>
  );
};

export default SubmissionSuccessModal;
