import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/authSlice";
import logo from "../assets/manisr_logo.svg";

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

        // Check if the user has preferences.
        const token = data.token;
        const userId = data.user.id;
        const resPreferences = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/preferences/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        let prefData = null;
        if (resPreferences.ok) {
          const json = await resPreferences.json();
          prefData = json.preferences;
        }
        if (!prefData) {
          // No preferences found → navigate to AccountDetails to set preferences.
          navigate("/account-details");
        } else {
          // Preferences exist → navigate to Menu.
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
    <div className="screen-container login-container">
      <img src={logo} alt="Logo" />
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
      <button className="greenBtn" onClick={handleLogin}>
        אישור
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Login;
