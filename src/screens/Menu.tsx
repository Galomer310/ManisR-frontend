// src/screens/Menu.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Menu: React.FC = () => {
  const navigate = useNavigate();

  const handleGiveMeal = () => {
    navigate("/food/upload");
  };

  const handleTakeMeal = () => {
    navigate("/collect-food");
  };

  return (
    <div className="screen-container centered">
      <h1>Welcome to Manisr</h1>
      <p>Please choose an option:</p>
      <div style={{ margin: "1rem" }}>
        <button onClick={handleGiveMeal} style={{ marginRight: "1rem" }}>
          I want to Give a Meal
        </button>
        <button onClick={handleTakeMeal}>I want to Take a Meal</button>
      </div>
    </div>
  );
};

export default Menu;
