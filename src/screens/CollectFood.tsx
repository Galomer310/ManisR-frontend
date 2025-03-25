// src/screens/CollectFood.tsx
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import L from "leaflet";
import axios from "axios";

/* 
  Interface for the meal object returned from the backend.
*/
interface Meal {
  id: number;
  item_description: string;
  pickup_address: string;
  box_option: "need" | "noNeed";
  food_types: string;
  ingredients: string;
  special_notes: string;
  image_url?: string | null;
  lat: number | null;
  lng: number | null;
  approved?: boolean;
}

/**
 * Calculates the distance (in km) between two points using the Haversine formula.
 */
const getDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const toRad = (value: number): number => (value * Math.PI) / 180;
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * CollectFood screen:
 * Fetches available meals, updates the map center based on user location preferences,
 * and filters meals according to the current search radius and food preference.
 */
const CollectFood: React.FC = () => {
  const locationPref = useSelector(
    (state: RootState) => state.preferences.location
  );
  const foodPref = useSelector((state: RootState) => state.preferences.food);

  const [center, setCenter] = useState<[number, number]>([32.0853, 34.7818]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [filteredMeals, setFilteredMeals] = useState<Meal[]>([]);
  const [error, setError] = useState("");

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

  // Update center based on location preference (geocoding not shown here for brevity)
  useEffect(() => {
    if (locationPref && locationPref.city) {
      // For simplicity, assume the city geocoding returns these coordinates:
      setCenter([32.0853, 34.7818]);
    }
  }, [locationPref]);

  useEffect(() => {
    if (!locationPref) return;
    const filtered = meals.filter((meal) => {
      if (meal.lat === null || meal.lng === null) return false;
      const distance = getDistance(center[0], center[1], meal.lat, meal.lng);
      if (distance > locationPref.radius) return false;
      if (foodPref && foodPref.foodPreference !== "No preferences") {
        if (!meal.food_types.includes(foodPref.foodPreference)) return false;
      }
      return true;
    });
    setFilteredMeals(filtered);
  }, [meals, locationPref, foodPref, center]);

  return (
    <div className="full-screen">
      <MapContainer center={center} zoom={14} className="map-container">
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {filteredMeals.map((meal) =>
          meal.lat && meal.lng ? (
            <Marker
              key={meal.id}
              position={[meal.lat, meal.lng]}
              icon={new L.Icon.Default()}
            >
              <Popup>
                <div>
                  <strong>{meal.item_description}</strong>
                  <p>{meal.pickup_address}</p>
                  <p>
                    Box Option:{" "}
                    {meal.box_option === "need" ? "Bring box" : "No box needed"}
                  </p>
                  <p>Food Types: {meal.food_types}</p>
                </div>
              </Popup>
            </Marker>
          ) : null
        )}
      </MapContainer>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default CollectFood;
