// src/screens/GiverMealScreen.tsx
import React, { useEffect, useState } from "react";
import Map, { Marker } from "react-map-gl";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "mapbox-gl/dist/mapbox-gl.css";

interface Meal {
  id: number;
  item_description: string;
  pickup_address: string;
  box_option: "need" | "noNeed";
  food_types: string;
  ingredients: string;
  special_notes: string;
  lat: number;
  lng: number;
  avatar_url: string; // URL to an image preview
  user_id: number; // owner's id
}

const GiverMealScreen: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  const localUserId = Number(localStorage.getItem("userId"));

  // Fetch all available meals.
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/food/available`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMeals(res.data.meals);
      } catch (err) {
        setError("Server error fetching meals.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, [API_BASE_URL]);

  // Handler to delete (cancel) the giver's meal.
  const handleConfirmCancel = async () => {
    if (!selectedMeal) return;
    try {
      const token = localStorage.getItem("token");
      // Delete the meal.
      await axios.delete(`${API_BASE_URL}/food/myMeal`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Delete associated conversation (if exists).
      try {
        await axios.delete(
          `${API_BASE_URL}/meal-conversation/${selectedMeal.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (err: any) {
        if (err.response && err.response.status === 404) {
          console.log("No conversation to delete.");
        } else {
          console.error("Error deleting conversation:", err);
        }
      }
      setConfirmModalOpen(false);
      setSelectedMeal(null);
      navigate("/menu");
    } catch (err) {
      console.error("Error cancelling meal:", err);
      setError("Server error cancelling meal.");
    }
  };

  // Handler: Closes the confirmation modal (leaves the meal).
  const handleLeaveIt = () => {
    setConfirmModalOpen(false);
  };

  // Handler: Edit meal.
  const handleEditMeal = (meal: Meal) => {
    navigate("/food/upload", { state: { meal } });
  };

  // Handler: Navigate to messages.
  const handleMessages = (meal: Meal) => {
    navigate("/messages", {
      state: { conversationId: meal.id.toString(), role: "giver" },
    });
  };

  if (loading) {
    return <div className="screen-container">Loading meals...</div>;
  }

  return (
    <div className="screen-container">
      {/* Summary Container for the selected meal (only for the giver's own meal) */}
      {selectedMeal && selectedMeal.user_id === localUserId && (
        <div
          className="mealCardGiver"
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            backgroundColor: "white",
            padding: "1rem",
            display: "flex",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            zIndex: 10,
          }}
        >
          {/* Image area (occupies ~33% width) */}
          <div style={{ width: "33%", textAlign: "center" }}>
            {selectedMeal.avatar_url ? (
              <img
                src={selectedMeal.avatar_url}
                alt="Meal"
                style={{
                  width: "100%",
                  maxWidth: "150px",
                  borderRadius: "8px",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "150px",
                  backgroundColor: "#eee",
                }}
              >
                אין תמונה
              </div>
            )}
          </div>
          {/* Details area (occupies ~67% width) */}
          <div style={{ width: "67%", paddingRight: "1rem" }}>
            <h3 style={{ margin: "0 0 0.5rem 0" }}>
              {selectedMeal.item_description}
            </h3>
            <p style={{ margin: "0 0 0.5rem 0" }}>
              {selectedMeal.pickup_address}
            </p>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setConfirmModalOpen(true);
              }}
              style={{ color: "red", textDecoration: "underline" }}
            >
              אני רוצה להסיר את המנה
            </a>
            <div style={{ marginTop: "0.5rem" }}>
              <button
                onClick={() => handleMessages(selectedMeal)}
                style={{ marginRight: "0.5rem" }}
              >
                הודעות
              </button>
              <button onClick={() => handleEditMeal(selectedMeal)}>
                עריכת מנה
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModalOpen && (
        <div
          className="confirmation-modal"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "1rem",
              borderRadius: "8px",
              textAlign: "center",
              width: "80%",
              maxWidth: "400px",
            }}
          >
            <p>האם אתה בטוח שברצונך להסיר את המנה?</p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                marginTop: "1rem",
              }}
            >
              <button onClick={handleConfirmCancel}>בטל מנה</button>
              <button onClick={handleLeaveIt}>השאר את המנה</button>
            </div>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div
        className="map-container"
        style={{ height: "60vh", marginTop: selectedMeal ? "150px" : "0" }}
      >
        <Map
          initialViewState={{
            latitude: 32.0853,
            longitude: 34.7818,
            zoom: 12,
          }}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        >
          {meals.map((meal) => (
            <Marker key={meal.id} latitude={meal.lat} longitude={meal.lng}>
              <div
                id="location-logo"
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedMeal(meal)}
              >
                📍
              </div>
            </Marker>
          ))}
        </Map>
      </div>
    </div>
  );
};

export default GiverMealScreen;
