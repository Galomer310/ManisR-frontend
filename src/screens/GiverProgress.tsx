import React, { useEffect, useState } from "react";
import axios from "axios";
import basketIcon from "../assets/basket.svg";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";

interface GiverProgressProps {
  userId: number;
  username?: string;
}

const GiverProgress: React.FC<GiverProgressProps> = ({ userId, username }) => {
  const [giverCount, setGiverCount] = useState<number>(0);
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  const navigate = useNavigate();

  // On mount, fetch how many meals the user has given.
  useEffect(() => {
    const fetchGiverCount = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API_BASE_URL}/meal_reviews/giverCount/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setGiverCount(res.data.count || 0);
      } catch (error) {
        console.error("Error fetching giver count:", error);
      }
    };
    if (userId) {
      fetchGiverCount();
    }
  }, [userId, API_BASE_URL]);

  const mealsRemaining = 10 - giverCount;
  const displayRemaining = mealsRemaining > 0 ? mealsRemaining : 0;

  return (
    <div style={{ padding: "1rem", textAlign: "center" }}>
      {/* Clickable Back Icon */}
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
      <h2>היי {username || "משתמש"} 👋</h2>
      <h3>בסל שלך יש</h3>
      <h3>{giverCount}</h3>
      <h3>פירות</h3>
      <img
        src={basketIcon}
        alt="Fruit Basket"
        style={{ width: "150px", marginBottom: "1rem" }}
      />
      <p>
        נותרו רק עוד {displayRemaining} פירות לצבור <br />
        !כדי לקבלת שוברים ממנה
      </p>
    </div>
  );
};

export default GiverProgress;
