// src/screens/GiverMealCardApproval.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FoodItem } from "../types";

/**
 * GiverMealCardApproval:
 * Fetches the food item by ID (passed via router state) and displays its details.
 * Also provides Approve and Cancel options.
 */
const GiverMealCardApproval: React.FC = () => {
  const navigate = useNavigate();
  const { foodItemId } = (useLocation().state as { foodItemId: number }) || {};
  const [foodItem, setFoodItem] = useState<FoodItem | null>(null);
  const [error, setError] = useState("");

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    if (!foodItemId) {
      setError("No food item ID provided. Please go back and upload again.");
      return;
    }
    const fetchFoodItem = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/food/${foodItemId}`);
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Error fetching food item");
        } else {
          const json = await res.json();
          setFoodItem(json.foodItem);
        }
      } catch (err) {
        console.error(err);
        setError("Server error retrieving food item");
      }
    };
    fetchFoodItem();
  }, [foodItemId, API_BASE_URL]);

  const handleApprove = () => {
    if (foodItem) {
      navigate("/giver-meal-map", { state: { foodItemId: foodItem.id } });
    } else {
      setError("Food item data is missing.");
    }
  };

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
      setError("Server error cancelling meal");
    }
  };

  if (error) {
    return (
      <div className="screen-container">
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={() => navigate("/give-food")}>Back</button>
      </div>
    );
  }

  if (!foodItem) {
    return (
      <div className="screen-container">
        <p>Loading food details...</p>
      </div>
    );
  }

  return (
    <div className="screen-container">
      <h2>Meal Card Approval</h2>
      <div
        style={{ border: "1px solid #ccc", padding: "16px", maxWidth: "400px" }}
      >
        <p>
          <strong>Item:</strong> {foodItem.item_description}
        </p>
        <p>
          <strong>Pickup Address:</strong> {foodItem.pickup_address}
        </p>
        <p>
          <strong>Box Option:</strong>{" "}
          {foodItem.box_option === "need" ? "Need to bring box" : "No need"}
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
            <p>
              <strong>Uploaded Image:</strong>
            </p>
            <img
              src={foodItem.avatar_url}
              alt="Uploaded food"
              style={{ width: "100%", maxWidth: "300px" }}
            />
          </div>
        )}
      </div>
      <p>Are all the details correct?</p>
      <div style={{ display: "flex", gap: "16px" }}>
        <button onClick={handleApprove}>Approve</button>
        <button onClick={handleCancelMeal}>Cancel Meal</button>
      </div>
    </div>
  );
};

export default GiverMealCardApproval;
