// src/screens/CollectFood.tsx
import React, { useEffect, useState } from "react";
import Map, { Marker } from "react-map-gl";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "mapbox-gl/dist/mapbox-gl.css";
import locationIcon from "../assets/location.png";

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
  avatar_url: string;
  user_id: number; // giver's id
}

const CollectFood: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const navigate = useNavigate();
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  const localUserId = Number(localStorage.getItem("userId"));

  // Fetch available meals.
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/food/available`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMeals(res.data.meals);
      } catch (err) {
        console.error("Server error fetching meals:", err);
      }
    };
    fetchMeals();
  }, [API_BASE_URL]);

  // When a taker clicks "View Meal Post", navigate to TakerMealCardApproval
  const handleViewMealPost = (meal: Meal) => {
    navigate("/taker-meal-card-approval", {
      state: { mealData: meal, imageFile: null, role: "taker" },
    });
  };

  return (
    <div className="screen-container" style={{ position: "relative" }}>
      {/* Fixed Burger Menu Icon (optional drop-down; you can add similar logic as in GiverMealScreen) */}
      <div
        style={{ position: "fixed", top: "1rem", right: "1rem", zIndex: 1100 }}
      >
        <div onClick={() => {}} style={{ cursor: "pointer" }}>
          <div
            style={{
              width: "25px",
              height: "3px",
              backgroundColor: "black",
              margin: "4px 0",
            }}
          ></div>
          <div
            style={{
              width: "25px",
              height: "3px",
              backgroundColor: "black",
              margin: "4px 0",
            }}
          ></div>
          <div
            style={{
              width: "25px",
              height: "3px",
              backgroundColor: "black",
              margin: "4px 0",
            }}
          ></div>
        </div>
      </div>

      {/* Meal Summary Overlay for taker (only if selectedMeal is not his own) */}
      {selectedMeal && selectedMeal.user_id !== localUserId && (
        <div
          className="mealCardTaker"
          style={{
            position: "absolute",
            top: "10%", // Adjust this value as needed
            left: "50%",
            transform: "translateX(-50%)",
            width: "90%",
            maxWidth: "500px",
            backgroundColor: "rgba(255,255,255,0.95)",
            padding: "1rem",
            boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
            zIndex: 1000,
            borderRadius: "8px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "row" }}>
            {/* Image area (approximately 33%) */}
            <div style={{ flex: "1", textAlign: "center" }}>
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
            {/* Details area (approximately 67%) */}
            <div style={{ flex: "2", paddingRight: "1rem" }}>
              <h3 style={{ margin: "0 0 0.5rem 0" }}>
                {selectedMeal.item_description}
              </h3>
              <p style={{ margin: "0 0 0.5rem 0" }}>
                {selectedMeal.pickup_address}{" "}
                <img
                  src={locationIcon}
                  alt="location icon"
                  style={{ width: "1rem", height: "1rem" }}
                />
              </p>
              {/* Button instead of a link */}
              <a onClick={() => handleViewMealPost(selectedMeal)}>
                View Meal Post
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Map Container covering full screen */}
      <div className="map-container" style={{ height: "100vh" }}>
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

export default CollectFood;
