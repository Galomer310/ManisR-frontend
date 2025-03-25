// src/screens/PreferencesFood.tsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * PreferencesFood screen:
 * Collects food preference and allergy selections and navigates to the food upload screen.
 */
const PreferencesFood: React.FC = () => {
  const navigate = useNavigate();
  const locationState = useLocation().state as { city: string; radius: number };
  const [foodPreference, setFoodPreference] = useState("No preferences");
  const [allergies, setAllergies] = useState<string[]>([]);
  const [error] = useState("");

  const toggleSelection = (value: string) => {
    if (allergies.includes(value)) {
      setAllergies(allergies.filter((a) => a !== value));
    } else {
      setAllergies([...allergies, value]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/food/upload", {
      state: { ...locationState, foodPreference, allergies },
    });
  };

  return (
    <div className="screen-container">
      <h2>Food Preferences</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div>
          <p>Select Food Preference:</p>
          <label>
            <input
              type="radio"
              name="foodPreference"
              value="Kosher vegetarian"
              checked={foodPreference === "Kosher vegetarian"}
              onChange={(e) => setFoodPreference(e.target.value)}
            />
            Kosher vegetarian
          </label>
          <br />
          <label>
            <input
              type="radio"
              name="foodPreference"
              value="Vegan"
              checked={foodPreference === "Vegan"}
              onChange={(e) => setFoodPreference(e.target.value)}
            />
            Vegan
          </label>
          <br />
          <label>
            <input
              type="radio"
              name="foodPreference"
              value="Vegetarian + fish"
              checked={foodPreference === "Vegetarian + fish"}
              onChange={(e) => setFoodPreference(e.target.value)}
            />
            Vegetarian + fish
          </label>
          <br />
          <label>
            <input
              type="radio"
              name="foodPreference"
              value="No preferences"
              checked={foodPreference === "No preferences"}
              onChange={(e) => setFoodPreference(e.target.value)}
            />
            No preferences
          </label>
        </div>
        <div>
          <p>Select Allergies (if any):</p>
          <label>
            <input
              type="checkbox"
              value="Milk"
              checked={allergies.includes("Milk")}
              onChange={() => toggleSelection("Milk")}
            />
            Milk
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              value="Gluten"
              checked={allergies.includes("Gluten")}
              onChange={() => toggleSelection("Gluten")}
            />
            Gluten
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              value="Eggs"
              checked={allergies.includes("Eggs")}
              onChange={() => toggleSelection("Eggs")}
            />
            Eggs
          </label>
        </div>
        <button type="submit">Next</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default PreferencesFood;
