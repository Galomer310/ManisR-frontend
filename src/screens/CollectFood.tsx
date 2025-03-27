import React, { useEffect, useState } from "react";
import Map, { Marker, Popup, Source, Layer } from "react-map-gl";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "mapbox-gl/dist/mapbox-gl.css";
import logo from "../assets/MNSR_logo.svg";

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

const CollectFood: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  // The viewport state is still used for the map display.
  const [viewport, setViewport] = useState({
    latitude: 32.0853,
    longitude: 34.7818,
    zoom: 13,
  });

  // State for route navigation.
  const [showRoute, setShowRoute] = useState(false);
  const [routeGeoJSON, setRouteGeoJSON] = useState<any>(null);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);

  // Fetch available meals.
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

  // Function to get the route from Mapbox Directions API.
  const getRoute = async (
    start: { lat: number; lng: number },
    end: { lat: number; lng: number }
  ) => {
    const token = import.meta.env.VITE_MAPBOX_TOKEN;
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.lng},${start.lat};${end.lng},${end.lat}?geometries=geojson&access_token=${token}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  };

  // Toggle navigation route display using the taker's current location.
  const toggleNavigate = async () => {
    if (!selectedMeal) return;
    if (!showRoute) {
      // Use the browser's geolocation API to get the user's current location.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const start = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            const end = { lat: selectedMeal.lat, lng: selectedMeal.lng };
            try {
              const data = await getRoute(start, end);
              if (
                data.routes &&
                data.routes.length > 0 &&
                data.routes[0].geometry &&
                data.routes[0].duration
              ) {
                setRouteGeoJSON(data.routes[0].geometry);
                setEstimatedTime(data.routes[0].duration); // duration in seconds
                setShowRoute(true);
              } else {
                alert("Could not get route data.");
              }
            } catch (err) {
              console.error("Error fetching route:", err);
              alert("Error fetching route.");
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            alert("Unable to retrieve your current location.");
          }
        );
      } else {
        alert("Geolocation is not supported by your browser.");
      }
    } else {
      // If route is already shown, remove it.
      setRouteGeoJSON(null);
      setEstimatedTime(null);
      setShowRoute(false);
    }
  };

  // Handler for when a taker accepts a meal.
  const handleAcceptMeal = async (meal: Meal) => {
    try {
      const token = localStorage.getItem("token");
      const userId = Number(localStorage.getItem("userId"));
      const defaultMessage = "I would like to pick up this meal.";
      // For a taker, the receiver should be the giver's id.
      const receiverId = meal.user_id;
      await axios.post(
        `${API_BASE_URL}/meal-conversation`,
        {
          mealId: meal.id,
          senderId: userId,
          receiverId,
          message: defaultMessage,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Navigate to the Messages screen and pass required state.
      navigate("/messages", {
        state: {
          conversationId: meal.id.toString(),
          receiverId: meal.user_id,
          role: "taker",
        },
      });
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // Define a layer style for the route line.
  // We cast this object as "any" to bypass strict type-checking on layout properties.
  const routeLayer: any = {
    id: "route",
    type: "line" as const,
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": "#888",
      "line-width": 6,
    },
  };

  return (
    <div className="screen-container collect-food-container">
      <div className="map-container" style={{ height: "50vh" }}>
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
                <img id="location-logo" src={logo} />
              </div>
            </Marker>
          ))}
          {selectedMeal && (
            <Popup
              latitude={selectedMeal.lat}
              longitude={selectedMeal.lng}
              closeOnClick={false}
              onClose={() => {
                setSelectedMeal(null);
                setShowRoute(false);
                setRouteGeoJSON(null);
                setEstimatedTime(null);
              }}
            >
              <div>
                <strong>{selectedMeal.item_description}</strong>
                <p>{selectedMeal.pickup_address}</p>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={() => handleAcceptMeal(selectedMeal)}>
                    Message Giver
                  </button>
                  <button onClick={toggleNavigate}>
                    {showRoute ? "Don't Navigate" : "Navigate"}
                  </button>
                </div>
                {showRoute && estimatedTime && (
                  <p>Estimated time: {Math.round(estimatedTime / 60)} min</p>
                )}
              </div>
            </Popup>
          )}
          {showRoute && routeGeoJSON && (
            <Source id="route" type="geojson" data={routeGeoJSON}>
              <Layer {...routeLayer} />
            </Source>
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
