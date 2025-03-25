// src/screens/GiverMealMapScreen.tsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GiverOSMMap from "../components/GiverOSMMap";
import { FoodItem } from "../types";

const GiverMealMapScreen: React.FC = () => {
  const { foodItemId } = (useLocation().state as { foodItemId: number }) || {};
  const navigate = useNavigate();
  const [foodItem, setFoodItem] = useState<FoodItem | null>(null);
  const [error, setError] = useState("");
  const [lat, setLat] = useState<number>(32.0853);
  const [lng, setLng] = useState<number>(34.7818);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    if (!foodItemId) {
      setError("No food item ID provided");
      return;
    }
    const fetchMeal = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/food/${foodItemId}`);
        if (!res.ok) {
          const errData = await res.json();
          setError(errData.error || "Error fetching meal");
          return;
        }
        const data = await res.json();
        const item: FoodItem = data.foodItem;
        setFoodItem(item);
        if (item.lat && item.lng) {
          setLat(Number(item.lat));
          setLng(Number(item.lng));
        }
      } catch (err) {
        console.error(err);
        setError("Server error fetching meal");
      }
    };
    fetchMeal();
  }, [foodItemId, API_BASE_URL]);

  const handleCancelMeal = async () => {
    if (!foodItemId) return;
    try {
      const res = await fetch(`${API_BASE_URL}/food/${foodItemId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to cancel meal");
        return;
      }
      navigate("/give-food");
    } catch (err) {
      console.error(err);
      setError("Server error canceling meal");
    }
  };

  if (error) {
    return (
      <div className="screen-container">
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  if (!foodItem) {
    return (
      <div className="screen-container">
        <p>Loading meal details...</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div style={{ flex: 1 }}>
        <GiverOSMMap lat={lat} lng={lng} />
      </div>
      <div
        style={{
          flex: 1,
          padding: "16px",
          overflowY: "auto",
          borderTop: "1px solid #ccc",
        }}
      >
        <h2>{foodItem.item_description}</h2>
        <p>
          <strong>Pickup Address:</strong> {foodItem.pickup_address}
        </p>
        <p>
          <strong>Box Option:</strong> {foodItem.box_option}
        </p>
        <p>
          <strong>Food Types:</strong> {foodItem.food_types}
        </p>
        <p>
          <strong>Ingredients:</strong> {foodItem.ingredients}
        </p>
        <p>
          <strong>Special Notes:</strong> {foodItem.special_notes}
        </p>
        {foodItem.avatar_url && (
          <div>
            <img
              src={foodItem.avatar_url}
              alt="Meal"
              style={{ width: "100%", maxWidth: "300px" }}
            />
          </div>
        )}
        <div style={{ marginTop: "16px" }}>
          <button onClick={handleCancelMeal}>Cancel/Edit Meal</button>
        </div>
      </div>
    </div>
  );
};

export default GiverMealMapScreen;
