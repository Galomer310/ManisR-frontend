import React, { useEffect, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";
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
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/food/myMeal`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMeal(response.data.meal);
      } catch (err) {
        setError("Server error fetching meal.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyMeal();
  }, [API_BASE_URL]);

  if (loading) {
    return <div className="screen-container">Loading your meal...</div>;
  }

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
      {/* Updated to react-map-gl */}
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
            <div>📍</div>
          </Marker>
          <Popup latitude={meal.lat} longitude={meal.lng} closeOnClick={false}>
            Pickup Location
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
        <button onClick={() => navigate("/food/upload", { state: { meal } })}>
          Edit Meal
        </button>
        <button onClick={() => navigate("/menu")}>Cancel Meal</button>
      </div>
    </div>
  );
};

export default GiverMealScreen;
