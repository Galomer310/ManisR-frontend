import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import grayLemon from "../assets/gray-lemon.svg";
import yellowLemon from "../assets/yellow-lemon.svg";
import ExitConfirmationModal from "../components/ExitConfirmationModal";

interface ReviewState {
  mealId?: number;
  userId?: number;
  role?: string; // "giver" or "taker"
}

const UserRateReview: React.FC = () => {
  const navigate = useNavigate();
  const locationState = useLocation().state as ReviewState;
  const { mealId, userId, role } = locationState || {};

  useEffect(() => {
    if (!mealId || !userId || !role) {
      alert("Meal review record not found. Please try again.");
      navigate("/menu");
    }
  }, [mealId, userId, role, navigate]);

  const [userReview, setUserReview] = useState<number>(0);
  const [generalExperience, setGeneralExperience] = useState<number>(0);
  const [comments, setComments] = useState("");
  const [showExitModal, setShowExitModal] = useState<boolean>(false);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  // Finalize the meal (archive it). If the meal is already archived, ignore 404.
  const finalizeMeal = async () => {
    if (!mealId) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/meal-history/archive/${mealId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        console.warn("Meal already archived.");
      } else {
        console.error("Error finalizing meal:", err);
        throw err;
      }
    }
  };

  const handleApprove = async () => {
    if (!mealId || !userId || !role) return;
    try {
      const token = localStorage.getItem("token");
      const payload = {
        meal_id: mealId,
        reviewer_id: userId,
        role: role,
        user_review: userReview,
        general_experience: generalExperience,
        comments: comments,
      };
      console.log("Submitting review payload:", payload);
      await axios.post(`${API_BASE_URL}/meal_reviews`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // After review submission, finalize the meal.
      await finalizeMeal();
      navigate("/review-success");
    } catch (error) {
      console.error("Error saving review:", error);
      alert("Error saving review. Please try again.");
    }
  };

  // Instead of immediately navigating away on "X", show the exit confirmation modal.
  const handleShowExitModal = () => {
    setShowExitModal(true);
  };

  // If user cancels exit, close the modal.
  const handleCloseExitModal = () => {
    setShowExitModal(false);
  };

  // If user confirms exit, navigate to the menu.
  const handleConfirmExit = () => {
    navigate("/menu");
  };

  return (
    <div className="screen-container rate-review-container">
      {/* Close icon: now triggers exit confirmation modal */}
      <div
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          cursor: "pointer",
          zIndex: 1000,
        }}
        onClick={handleShowExitModal}
      >
        <IoMdClose size={24} />
      </div>
      <h2>? נו, איך היה </h2>
      <p>
        הדעה שלך עוזרת לנו לשמור על
        <br /> האפליקציה נעימה ובטוחה לשימוש
      </p>

      <div className="rating-section">
        <h3>ההתנהלות מול הצד השני</h3>
        <div className="rating-options">
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value} style={{ cursor: "pointer" }}>
              <input
                type="radio"
                name="rating1"
                value={value}
                style={{ display: "none" }}
                onChange={() => setUserReview(value)}
              />
              <img
                src={value <= userReview ? yellowLemon : grayLemon}
                alt={`Rating ${value}`}
                style={{ width: "30px", height: "30px" }}
                onClick={() => setUserReview(value)}
              />
            </label>
          ))}
        </div>
      </div>

      <div className="rating-section">
        <h3>החוויה הכללית</h3>
        <div className="rating-options">
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value} style={{ cursor: "pointer" }}>
              <input
                type="radio"
                name="rating2"
                value={value}
                style={{ display: "none" }}
                onChange={() => setGeneralExperience(value)}
              />
              <img
                src={value <= generalExperience ? yellowLemon : grayLemon}
                alt={`Rating ${value}`}
                style={{ width: "30px", height: "30px" }}
                onClick={() => setGeneralExperience(value)}
              />
            </label>
          ))}
        </div>
      </div>

      <div className="review-section">
        <h3>? יש משהו שהיית רוצה להוסיף</h3>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="...הערות והארות"
          rows={5}
          style={{ width: "100%", padding: "0.5rem" }}
        ></textarea>
      </div>

      <button className="greenBtn" onClick={handleApprove}>
        אישור
      </button>

      {/* Exit Confirmation Modal */}
      <ExitConfirmationModal
        show={showExitModal}
        onClose={handleCloseExitModal}
        onConfirm={handleConfirmExit}
      />
    </div>
  );
};

export default UserRateReview;
