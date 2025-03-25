// src/screens/Menu.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * Menu component:
 * Presents two options: "I want to Give a Meal" and "I want to Take a Meal".
 * Navigates to the corresponding route when a button is clicked.
 */
const Menu: React.FC = () => {
  const navigate = useNavigate();

  const handleGiveMeal = () => {
    // Navigate to the page where users can upload a food item (giving a meal)
    navigate("/food/upload");
  };

  const handleTakeMeal = () => {
    // Navigate to the page where users can collect a meal (view available meals)
    navigate("/collect-food");
  };

  return (
    <div
      className="screen-container"
      style={{ textAlign: "center", padding: "2rem" }}
    >
      <h1>Welcome to Manisr</h1>
      <p>Please choose an option:</p>
      <div style={{ margin: "1rem" }}>
        <button
          onClick={handleGiveMeal}
          style={{ marginRight: "1rem", padding: "1rem 2rem" }}
        >
          I want to Give a Meal
        </button>
        <button onClick={handleTakeMeal} style={{ padding: "1rem 2rem" }}>
          I want to Take a Meal
        </button>
      </div>
    </div>
  );
};

export default Menu;
