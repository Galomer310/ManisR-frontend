import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Map, { Marker, Popup } from "react-map-gl";
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
  avatar_url: string;
}

const GiverMealScreen: React.FC = () => {
  const [meal, setMeal] = useState<Meal | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchMyMeal = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${API_BASE_URL}/food/myMeal`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // If no meal exists, response.data.meal will be null.
        setMeal(response.data.meal);
      } catch (err: any) {
        setError(err.response?.data.error || "Error fetching meal.");
      } finally {
        setLoading(false);
      }
    };
    fetchMyMeal();
  }, [API_BASE_URL]);

  const handleEdit = () => navigate("/food/upload", { state: { meal } });

  const handleCancel = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_BASE_URL}/food/myMeal`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/menu");
    } catch (err) {
      setError("Server error cancelling meal.");
    }
  };

  if (loading) {
    return <div className="screen-container">Loading your meal...</div>;
  }

  if (error || !meal) {
    return (
      <div className="screen-container">
        <p className="error">{error || "No meal found. Please upload one."}</p>
        <button onClick={() => navigate("/menu")}>Create a Meal</button>
      </div>
    );
  }

  return (
    <div className="screen-container">
      <div className="map-container">
        <Map
          initialViewState={{
            latitude: meal.lat,
            longitude: meal.lng,
            zoom: 14,
          }}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        >
          <Marker latitude={meal.lat} longitude={meal.lng}>
            <div style={{ fontSize: "24px" }}>📍</div>
          </Marker>
          <Popup latitude={meal.lat} longitude={meal.lng} closeOnClick={false}>
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
        <button onClick={handleEdit}>Edit Meal</button>
        <button onClick={handleCancel}>Cancel Meal</button>
      </div>
    </div>
  );
};

export default GiverMealScreen;
