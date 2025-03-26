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
  user_id: number;
}

const GiverMealScreen: React.FC = () => {
  const [meal, setMeal] = useState<Meal | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [messageCount, setMessageCount] = useState(0);
  const navigate = useNavigate();
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  // Fetch the giver's meal.
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

  // Fetch the conversation message count for this meal.
  useEffect(() => {
    const fetchConversationCount = async () => {
      try {
        if (meal) {
          const token = localStorage.getItem("token");
          const res = await axios.get(
            `${API_BASE_URL}/meal_conversation/count/${meal.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setMessageCount(res.data.count);
        }
      } catch (err) {
        console.error("Error fetching conversation count:", err);
      }
    };
    fetchConversationCount();
  }, [meal, API_BASE_URL]);

  // Handler for editing the meal.
  const handleEdit = () => {
    if (meal) {
      navigate("/food/upload", { state: { meal } });
    }
  };

  // Handler for cancelling the meal.
  const handleCancel = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/food/myMeal`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Also delete the conversation for this meal.
      await axios.delete(`${API_BASE_URL}/meal_conversation/${meal?.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/menu");
    } catch (err) {
      setError("Server error cancelling meal.");
      console.error(err);
    }
  };

  // Handler for opening the chat room.
  const handleMessages = () => {
    if (meal) {
      // Navigate to the ChatRoom component, passing the meal's id as conversationId.
      navigate("/chat", { state: { conversationId: String(meal.id) } });
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
      {/* Upper half: Map showing the meal location */}
      <div className="map-container" style={{ height: "50vh" }}>
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
            <div>Pickup Location</div>
          </Popup>
        </Map>
      </div>
      {/* Lower half: Meal details and action buttons */}
      <div className="meal-summary">
        <h2>Your Meal</h2>
        <p>
          <strong>Description:</strong> {meal.item_description}
        </p>
        <p>
          <strong>Address:</strong> {meal.pickup_address}
        </p>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button onClick={handleEdit}>Edit Meal</button>
          <button onClick={handleCancel}>Cancel Meal</button>
          <button onClick={handleMessages} disabled={messageCount === 0}>
            Messages {messageCount > 0 ? `(${messageCount})` : ""}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GiverMealScreen;
