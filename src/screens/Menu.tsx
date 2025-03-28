// src/screens/Menu.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/manisr_logo.svg";
import giver from "../assets/Giver.svg";
import taker from "../assets/Taker.svg";

const Menu: React.FC = () => {
  const navigate = useNavigate();

  const handleGiveMeal = () => {
    navigate("/food/upload");
  };

  const handleTakeMeal = () => {
    navigate("/collect-food");
  };

  return (
    <div className="screen-container menu-container centered">
      <img src={logo} alt="Manisr Logo" />

      <div style={{ margin: "5rem" }}>
        <button onClick={handleGiveMeal} style={{ marginRight: "1rem" }}>
          <img src={giver} alt="Give a Meal" />
        </button>
        <button onClick={handleTakeMeal}>
          <img src={taker} alt="Take a Meal" />
        </button>
      </div>
    </div>
  );
};

export default Menu;
