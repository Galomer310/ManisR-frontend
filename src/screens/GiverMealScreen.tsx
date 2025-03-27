// GiverMealScreen.tsx
import React, { useEffect, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

const GiverMealScreen: React.FC = () => {
  const [meal, setMeal] = useState<Meal | null>(null);
  const [convCount, setConvCount] = useState<number>(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  // Fetch the current user's (giver's) meal.
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

  // Fetch conversation count for the meal.
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
      // Delete the associated conversation if it exists.
      if (meal) {
        try {
          await axios.delete(`${API_BASE_URL}/meal-conversation/${meal.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (err: any) {
          if (err.response && err.response.status === 404) {
            console.log("No conversation to delete.");
          } else {
            console.error("Error deleting conversation:", err);
          }
        }
      }
      navigate("/menu");
    } catch (err) {
      console.error("Error cancelling meal:", err);
      setError("Server error cancelling meal.");
    }
  };

  // When the giver clicks "Messages", try to determine the taker's id.
  const handleMessages = async () => {
    if (meal) {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API_BASE_URL}/meal-conversation/${meal.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const conv = res.data.conversation;
        let takerId = 0;
        if (conv && conv.length > 0) {
          // Find the first message not sent by the giver.
          const takerMessage = conv.find(
            (msg: any) =>
              msg.senderId !== Number(localStorage.getItem("userId"))
          );
          takerId = takerMessage ? takerMessage.senderId : 0;
        }
        if (takerId === 0) {
          alert("No taker has responded yet.");
          return;
        }
        navigate("/messages", {
          state: {
            conversationId: meal.id.toString(),
            receiverId: takerId,
            role: "giver",
          },
        });
      } catch (err) {
        console.error("Error fetching conversation for messages:", err);
      }
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
          <button onClick={handleMessages}>
            Messages {convCount > 0 ? `(${convCount})` : ""}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GiverMealScreen;
