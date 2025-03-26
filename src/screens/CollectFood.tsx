// src/screens/CollectFood.tsx
import React, { useEffect, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "mapbox-gl/dist/mapbox-gl.css";
import { calculateDistance, estimateTravelTime } from "../utils/distance";

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
  user_id: number; // Giver’s user ID
  avatar_url: string;
}

const CollectFood: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [error, setError] = useState("");
  const [takerLocation, setTakerLocation] = useState({
    latitude: 32.0853,
    longitude: 34.7818,
  });
  const [viewport, setViewport] = useState({
    latitude: 32.0853,
    longitude: 34.7818,
    zoom: 13,
  });
  const navigate = useNavigate();
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  // Get taker's current location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setTakerLocation({
            latitude: coords.latitude,
            longitude: coords.longitude,
          });
          setViewport((prev) => ({
            ...prev,
            latitude: coords.latitude,
            longitude: coords.longitude,
          }));
        },
        (err) => {
          console.error("Error getting taker location:", err);
          setError("Unable to retrieve your location.");
        }
      );
    }
  }, []);

  // Fetch available meals from the backend
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/food/available`);
        setMeals(response.data.meals);
      } catch (err) {
        console.error("Error fetching meals:", err);
        setError("Server error retrieving available meals");
      }
    };
    fetchMeals();
  }, [API_BASE_URL]);

  // Handler for when the taker accepts a meal.
  const handleAcceptMeal = async (meal: Meal) => {
    const senderId = Number(localStorage.getItem("userId")); // User B (taker)
    const receiverId = meal.user_id; // User A (giver)
    const defaultMessage = "I would like to accept your meal offer.";
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in again.");
        return;
      }
      await axios.post(
        `${API_BASE_URL}/messages`,
        { senderId, receiverId, message: defaultMessage },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Navigate to the ChatRoom passing receiverId and role ("taker")
      navigate("/chat", { state: { receiverId, role: "taker" } });
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Error sending accept message.");
    }
  };

  return (
    <div className="screen-container collect-food-container">
      <div className="map-container">
        <Map
          initialViewState={viewport}
          style={{ width: "100%", height: "100%" }}
          onMove={(evt) => setViewport(evt.viewState)}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        >
          {meals.map((meal) => (
            <Marker key={meal.id} latitude={meal.lat} longitude={meal.lng}>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedMeal(meal)}
              >
                📍
              </div>
            </Marker>
          ))}
          {selectedMeal && (
            <Popup
              latitude={selectedMeal.lat}
              longitude={selectedMeal.lng}
              closeOnClick={false}
              onClose={() => setSelectedMeal(null)}
            >
              <div>
                <strong>{selectedMeal.item_description}</strong>
                <p>{selectedMeal.pickup_address}</p>
                {takerLocation && (
                  <>
                    <p>
                      Distance:{" "}
                      {calculateDistance(
                        takerLocation.latitude,
                        takerLocation.longitude,
                        selectedMeal.lat,
                        selectedMeal.lng
                      ).toFixed(2)}{" "}
                      km
                    </p>
                    <p>
                      Estimated travel time:{" "}
                      {estimateTravelTime(
                        calculateDistance(
                          takerLocation.latitude,
                          takerLocation.longitude,
                          selectedMeal.lat,
                          selectedMeal.lng
                        )
                      ).toFixed(0)}{" "}
                      mins
                    </p>
                  </>
                )}
                <button onClick={() => handleAcceptMeal(selectedMeal)}>
                  Accept Meal
                </button>
              </div>
            </Popup>
          )}
        </Map>
      </div>
      <div className="meal-list-container">
        <h2>Available Meals</h2>
        {error && <p className="error">{error}</p>}
        {meals.length === 0 ? (
          <p>No meals available.</p>
        ) : (
          meals.map((meal) => (
            <div className="meal-card" key={meal.id}>
              <strong>{meal.item_description}</strong>
              <p>{meal.pickup_address}</p>
            </div>
          ))
        )}
        <button onClick={() => navigate("/menu")}>Cancel Request</button>
      </div>
    </div>
  );
};

export default CollectFood;
