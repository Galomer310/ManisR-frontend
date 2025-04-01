// src/screens/GiverProgressPage.tsx
import React from "react";
import GiverProgress from "../screens/GiverProgress";

const GiverProgressPage: React.FC = () => {
  const userId = Number(localStorage.getItem("userId")) || 0;
  const userString = localStorage.getItem("user");
  const username = userString ? JSON.parse(userString).name : "משתמש";

  return <GiverProgress userId={userId} username={username} />;
};

export default GiverProgressPage;
