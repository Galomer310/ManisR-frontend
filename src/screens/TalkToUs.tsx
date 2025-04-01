// src/screens/TalkToUs.tsx
import React, { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import SubmissionSuccessModal from "../components/SubmissionSuccessModal";

const TalkToUs: React.FC = () => {
  const navigate = useNavigate();

  // Local state for form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // State to control the success modal visibility
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: handle form submission logic (e.g. send to backend)
    console.log({ fullName, email, message });
    // Instead of alerting, show the submission success modal
    setShowSuccessModal(true);
  };

  // When the modal is closed, navigate back (or to a desired route)
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate(-1);
  };

  return (
    <div className="screen-container talk-to-us-container">
      {/* Top Right Back Icon */}
      <div className="back-icon" onClick={() => navigate(-1)}>
        <IoIosArrowForward size={24} color="black" />
      </div>

      <h2>דברו איתנו</h2>
      <p>
        אנחנו תמיד שמחים לעזור{" "}
        <span role="img" aria-label="smile">
          🙂
        </span>{" "}
        מלא/י את הטופס ונחזיר הודעה באמצעות הדוא"ל בהקדם.
      </p>

      <form className="talk-to-us-form" onSubmit={handleSubmit}>
        <label htmlFor="fullName">שם מלא</label>
        <input
          id="fullName"
          type="text"
          placeholder="ישראל ישראלי"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <label htmlFor="email">דוא"ל</label>
        <input
          id="email"
          type="email"
          placeholder="israela@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="message">ההודעה שלך</label>
        <textarea
          id="message"
          placeholder="מה אפשר לעזור?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          required
        />

        <button type="submit" className="greenBtn">
          אישור
        </button>
      </form>

      {/* Submission Success Modal */}
      <SubmissionSuccessModal
        show={showSuccessModal}
        onClose={handleCloseSuccessModal}
      />
    </div>
  );
};

export default TalkToUs;
