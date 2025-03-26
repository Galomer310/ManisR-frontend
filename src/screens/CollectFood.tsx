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

const CollectFood: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [viewport, setViewport] = useState({
    latitude: 32.0853,
    longitude: 34.7818,
    zoom: 13,
  });

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

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
