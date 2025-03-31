// src/screens/UsageHistory.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface MealHistory {
  id: number;
  meal_id: number;
  giver_id: number;
  taker_id: number;
  item_description: string;
  pickup_address: string;
  meal_image?: string;
  created_at: string;
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

  const handleDelete = async (historyId: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/meal-history/${historyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory((prev) => prev.filter((entry) => entry.id !== historyId));
    } catch (error) {
      console.error("Error deleting history entry:", error);
    }
  };

  return (
    <div
      className="screen-container usage-history-container"
      style={{ padding: "1rem" }}
    >
      <h2>Usage History</h2>
      {history.length === 0 ? (
        <p>No past meals found.</p>
      ) : (
        history.map((entry) => {
          const roleLabel =
            localUserId === entry.giver_id ? "Given Meal" : "Collected Meal";
          return (
            <div
              key={entry.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "1rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={entry.meal_image || "https://via.placeholder.com/100"}
                  alt="Meal"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginRight: "1rem",
                  }}
                />
                <div>
                  <h3>{entry.item_description}</h3>
                  <p>{entry.pickup_address}</p>
                  <p>
                    <strong>{roleLabel}</strong>
                  </p>
                  <small>{new Date(entry.created_at).toLocaleString()}</small>
                </div>
              </div>
              <button
                onClick={() => handleDelete(entry.id)}
                style={{
                  marginTop: "0.5rem",
                  padding: "0.5rem 1rem",
                  backgroundColor: "#dc3545",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          );
        })
      )}
      <button
        onClick={() => navigate("/menu")}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Back to Menu
      </button>
    </div>
  );
};

export default UsageHistory;
