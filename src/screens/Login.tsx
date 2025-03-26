// src/screens/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/authSlice";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Login failed.");
      } else {
        dispatch(setUser(data.user));
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.id.toString());
        // Check if the user has a meal
        const token = data.token;
        const resMyMeal = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/food/myMeal`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (resMyMeal.ok) {
          navigate("/giver-meal-screen");
        } else if (resMyMeal.status === 404) {
          navigate("/menu");
        } else {
          console.error(
            "Unexpected error fetching meal:",
            await resMyMeal.text()
          );
          navigate("/menu");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Server error during login.");
      navigate("/menu");
    }
  };

  return (
    <div className="screen-container">
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Login;
