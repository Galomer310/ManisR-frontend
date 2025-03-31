// src/screens/UsageHistory.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoIosArrowForward } from "react-icons/io";

interface MealHistory {
  id: number;
  meal_id: number;
  giver_id: number;
  taker_id: number;
  item_description: string;
  pickup_address: string;
  meal_image?: string;
  created_at: string;
  // New fields for the user names
  giver_name?: string;
  taker_name?: string;
}

const UsageHistory: React.FC = () => {
  const navigate = useNavigate();
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const localUserId = Number(localStorage.getItem("userId"));
  const [history, setHistory] = useState<MealHistory[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/meal-history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(res.data.history);
      } catch (error) {
        console.error("Error fetching usage history:", error);
      }
    };
    fetchHistory();
  }, [API_BASE_URL]);

  // Separate history into "collected" and "given"
  const collectedMeals = history.filter(
    (entry) => entry.taker_id === localUserId
  );
  const givenMeals = history.filter((entry) => entry.giver_id === localUserId);

  return (
    <div className="usage-history" dir="rtl" style={{ padding: "1rem" }}>
      {/* Header row with Back Arrow */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <div style={{ cursor: "pointer" }} onClick={() => navigate(-1)}>
          <IoIosArrowForward size={24} color="black" />
        </div>
      </div>
      {/* "לכל המנות" button */}
      <button
        onClick={() => navigate("/menu")}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#007bff",
          fontSize: "1rem",
        }}
      >
        לכל המנות
      </button>

      {/* Title */}
      <h1 style={{ margin: 0 }}>היסטוריית שימוש</h1>

      {/* "מנות שאספתי" Section */}
      <h2 style={{ fontSize: "1.2rem", margin: "1rem 0 0.5rem" }}>
        מנות שאספתי
      </h2>
      {collectedMeals.length === 0 ? (
        <p>לא נמצאו מנות שאספתי.</p>
      ) : (
        collectedMeals.map((entry) => {
          const imageUrl =
            entry.meal_image && entry.meal_image.startsWith("/uploads/")
              ? `${API_BASE_URL}${entry.meal_image}`
              : entry.meal_image || "https://via.placeholder.com/80";

          // Determine the other user's name.
          // If the local user is the taker, the other user is the giver.
          const otherUserName =
            localUserId === entry.taker_id
              ? entry.giver_name
              : entry.taker_name;

          return (
            <div className="historyMealsCard" key={entry.id}>
              <div>
                <h3 style={{ margin: 0 }}>{entry.item_description}</h3>
                <p style={{ margin: "0.2rem 0" }}>{entry.pickup_address}</p>
                {otherUserName && (
                  <p style={{ margin: "0.2rem 0", fontStyle: "italic" }}>
                    {otherUserName}
                  </p>
                )}
                <small style={{ color: "#666" }}>
                  {new Date(entry.created_at).toLocaleDateString("he-IL")}
                </small>
              </div>
              <img
                src={imageUrl}
                alt="Meal"
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginLeft: "1rem",
                }}
              />
            </div>
          );
        })
      )}

      {/* "מנות שמסרת" Section */}
      <h2 style={{ fontSize: "1.2rem", margin: "1rem 0 0.5rem" }}>
        מנות שמסרת
      </h2>
      {givenMeals.length === 0 ? (
        <p>לא נמצאו מנות שמסרתי.</p>
      ) : (
        givenMeals.map((entry) => {
          const imageUrl =
            entry.meal_image && entry.meal_image.startsWith("/uploads/")
              ? `${API_BASE_URL}${entry.meal_image}`
              : entry.meal_image || "https://via.placeholder.com/80";

          // Determine the other user's name.
          // If the local user is the giver, the other user is the taker.
          const otherUserName =
            localUserId === entry.giver_id
              ? entry.taker_name
              : entry.giver_name;

          return (
            <div className="historyMealsCard" key={entry.id}>
              <div>
                <h3 style={{ margin: 0 }}>{entry.item_description}</h3>
                <p style={{ margin: "0.2rem 0" }}>{entry.pickup_address}</p>
                {otherUserName && (
                  <p style={{ margin: "0.2rem 0", fontStyle: "italic" }}>
                    {otherUserName}
                  </p>
                )}
                <small style={{ color: "#666" }}>
                  {new Date(entry.created_at).toLocaleDateString("he-IL")}
                </small>
              </div>
              <img
                src={imageUrl}
                alt="Meal"
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginLeft: "1rem",
                }}
              />
            </div>
          );
        })
      )}
    </div>
  );
};

export default UsageHistory;
