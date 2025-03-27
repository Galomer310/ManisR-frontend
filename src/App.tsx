// App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LaunchScreen from "./screens/LaunchScreen";
import LoginRegister from "./screens/LoginRegister";
import Register from "./screens/Register";
import Login from "./screens/Login";
import VerifyEmail from "./screens/VerifyEmail";
import Menu from "./screens/Menu";
import FoodUpload from "./screens/FoodUpload";
import GiverMealScreen from "./screens/GiverMealScreen";
import CollectFood from "./screens/CollectFood";
import Messages from "./screens/Messages";
import RegisterIntro from "./screens/RegisterIntro";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LaunchScreen />} />
        <Route path="/auth" element={<LoginRegister />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/food/upload" element={<FoodUpload />} />
        <Route path="/giver-meal-screen" element={<GiverMealScreen />} />
        <Route path="/collect-food" element={<CollectFood />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/register-intro" element={<RegisterIntro />} />
      </Routes>
    </Router>
  );
};

export default App;
