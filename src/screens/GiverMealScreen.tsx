// src/screens/GiverMealScreen.tsx
import React, { useEffect, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "mapbox-gl/dist/mapbox-gl.css";
import { FoodItem } from "../types";

const GiverMealScreen: React.FC = () => {
  const [meal, setMeal] = useState<FoodItem | null>(null);
  const [error, setError] = useState("");
  const [viewport, setViewport] = useState({
    latitude: 32.0853,
    longitude: 34.7818,
    zoom: 14,
  });
  const navigate = useNavigate();
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchMyMeal = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/food/myMeal`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMeal(response.data.meal);
        if (
          response.data.meal &&
          response.data.meal.lat &&
          response.data.meal.lng
        ) {
          setViewport((prev) => ({
            ...prev,
            latitude: response.data.meal.lat,
            longitude: response.data.meal.lng,
          }));
        }
      } catch (err: any) {
        if (err.response && err.response.status === 404) {
          setError("No meal found for this user.");
        } else {
          setError("Server error fetching meal.");
        }
      }
    };
    fetchMyMeal();
  }, [API_BASE_URL]);

  const handleEdit = () => {
    if (meal) {
      navigate("/food/upload", { state: { meal } });
    }
  };

  const handleCancel = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/food/myMeal`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/menu");
    } catch (err) {
      setError("Server error cancelling meal.");
    }
  };

  if (error || !meal) {
    return (
      <div className="screen-container">
        <p className="error">{error || "No meal found."}</p>
        <button onClick={() => navigate("/menu")}>Create a Meal</button>
      </div>
    );
  }

  return (
    <div className="screen-container">
      <div className="map-container" style={{ height: "50vh" }}>
        <Map
          initialViewState={{
            latitude: meal.lat || 32.0853,
            longitude: meal.lng || 34.7818,
            zoom: 14,
          }}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
          onMove={(evt) => setViewport(evt.viewState)}
        >
          <Marker latitude={meal.lat!} longitude={meal.lng!}>
            <div>📍</div>
          </Marker>
          <Popup
            latitude={meal.lat!}
            longitude={meal.lng!}
            closeOnClick={false}
          >
            <div>Pickup Location</div>
          </Popup>
        </Map>
      </div>
      <div className="meal-summary">
        <h2>Your Meal</h2>
        <p>
          <strong>Description:</strong> {meal.item_description}
        </p>
        <p>
          <strong>Address:</strong> {meal.pickup_address}
        </p>
        <p>
          <strong>Box Option:</strong>{" "}
          {meal.box_option === "need" ? "Bring box" : "No box needed"}
        </p>
        <p>
          <strong>Food Types:</strong> {meal.food_types}
        </p>
        <p>
          <strong>Ingredients:</strong> {meal.ingredients}
        </p>
        <p>
          <strong>Special Notes:</strong> {meal.special_notes}
        </p>
        {meal.avatar_url && (
          <div>
            <img
              src={
                meal.avatar_url.startsWith("http")
                  ? meal.avatar_url
                  : `${API_BASE_URL}/uploads/${meal.avatar_url}`
              }
              alt="Meal"
              style={{ width: "100%", maxWidth: "300px" }}
            />
          </div>
        )}
        <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
          <button onClick={handleEdit}>Edit Meal</button>
          <button onClick={handleCancel}>Cancel Meal</button>
        </div>
      </div>
    </div>
  );
};

export default GiverMealScreen;
