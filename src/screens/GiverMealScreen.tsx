// src/screens/GiverMealScreen.tsx
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
  const [convCount, setConvCount] = useState<number>(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  // Fetch the current user's meal.
  useEffect(() => {
    const fetchMyMeal = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/food/myMeal`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMeal(res.data.meal);
      } catch (err: any) {
        setError("Server error fetching meal.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyMeal();
  }, [API_BASE_URL]);

  // Once the meal is fetched, fetch the conversation count.
  useEffect(() => {
    const fetchConversationCount = async () => {
      if (meal) {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get(
            `${API_BASE_URL}/meal-conversation/count/${meal.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          // If the endpoint returns 404, we treat it as zero messages.
          setConvCount(res.data.count);
        } catch (err: any) {
          if (err.response && err.response.status === 404) {
            setConvCount(0);
          } else {
            console.error("Error fetching conversation count:", err);
          }
        }
      }
    };
    fetchConversationCount();
  }, [API_BASE_URL, meal]);

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
      // Also, when canceling, you might want to delete the associated conversation.
      if (meal) {
        await axios.delete(`${API_BASE_URL}/meal-conversation/${meal.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      navigate("/menu");
    } catch (err) {
      console.error("Error cancelling meal:", err);
      setError("Server error cancelling meal.");
    }
  };

  // Navigate to the chat room; only enable if convCount > 0 (or you want to allow sending the first message)
  const handleMessages = () => {
    if (meal) {
      navigate("/chat", { state: { mealId: meal.id } });
    }
  };

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
      <div className="map-container" style={{ height: "60vh" }}>
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
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <button onClick={handleEdit}>Edit Meal</button>
          <button onClick={handleCancel}>Cancel Meal</button>
          {/* Messages button becomes enabled if there are any messages */}
          <button onClick={handleMessages}>
            Messages {convCount > 0 ? `(${convCount})` : ""}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GiverMealScreen;
