// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LaunchScreen from "./screens/LaunchScreen";
import LoginRegister from "./screens/LoginRegister"; // A landing page with options to log in or register
import Register from "./screens/Register";
import Login from "./screens/Login";
import VerifyEmail from "./screens/VerifyEmail";
import PreferencesLocation from "./screens/PreferencesLocation";
import PreferencesFood from "./screens/PreferencesFood";
import FoodUpload from "./screens/FoodUpload";
import GiverMealCardApproval from "./screens/GiverMealCardApproval";
import HomePage from "./screens/HomePage";
import Profile from "./screens/Profile";
import Messages from "./screens/Messages";
import Settings from "./screens/Settings";
import TalkToUs from "./screens/TalkToUs";
import UnderConstruction from "./screens/UnderConstruction";
import GiverMealMapScreen from "./screens/GiverMealMapScreen";
import ChatRoom from "./components/ChatRoom";

// Remove outdated routes like RegisterCode, LoginCode, etc.

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LaunchScreen />} />
        <Route path="/auth" element={<LoginRegister />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/preferences/location" element={<PreferencesLocation />} />
        <Route path="/preferences/food" element={<PreferencesFood />} />
        <Route path="/food/upload" element={<FoodUpload />} />
        <Route
          path="/giver-meal-approval"
          element={<GiverMealCardApproval />}
        />
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/talk-to-us" element={<TalkToUs />} />
        <Route path="/under-construction" element={<UnderConstruction />} />
        <Route path="/giver-meal-map" element={<GiverMealMapScreen />} />
        <Route path="/chat" element={<ChatRoom />} />
      </Routes>
    </Router>
  );
};

export default App;
