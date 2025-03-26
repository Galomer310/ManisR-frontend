// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LaunchScreen from "./screens/LaunchScreen";
import LoginRegister from "./screens/LoginRegister";
import Register from "./screens/Register";
import Login from "./screens/Login";
import VerifyEmail from "./screens/VerifyEmail";
import PreferencesLocation from "./screens/PreferencesLocation";
import PreferencesFood from "./screens/PreferencesFood";
import FoodUpload from "./screens/FoodUpload";
import GiverMealScreen from "./screens/GiverMealScreen";
import CollectFood from "./screens/CollectFood";
import Menu from "./screens/Menu";
import Profile from "./screens/Profile";
import Messages from "./screens/Messages";
import Settings from "./screens/Settings";
import TalkToUs from "./screens/TalkToUs";
import UnderConstruction from "./screens/UnderConstruction";
import ChatRoom from "./components/ChatRoom";
import DeviceLocationMap from "./components/DeviceLocationMap";

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
        <Route path="/giver-meal-screen" element={<GiverMealScreen />} />
        <Route path="/collect-food" element={<CollectFood />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/home" element={<Menu />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/talk-to-us" element={<TalkToUs />} />
        <Route path="/under-construction" element={<UnderConstruction />} />
        <Route path="/chat" element={<ChatRoom />} />
        <Route path="/device-location" element={<DeviceLocationMap />} />
      </Routes>
    </Router>
  );
};

export default App;
