// src/screens/LoginRegister.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/manisr_logo.svg";

/**
 * LoginRegister is the landing screen that provides two clear options:
 * - Register (navigates to the new Register.tsx)
 * - Login (navigates to the new Login.tsx)
 */
const LoginRegister: React.FC = () => {
  const navigate = useNavigate();

  // Navigate to the registration screen
  const handleRegisterClick = () => {
    navigate("/register-intro");
  };

  // Navigate to the login screen
  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="screen-container login-register centered">
      <img
        src={logo}
        alt="Manisr Logo"
        style={{ width: 200, marginBottom: 20 }}
      />
      <h1>Rמניש</h1>
      <button onClick={handleRegisterClick}>הרשמה</button>
      <button id="already-register" onClick={handleLoginClick}>
        יש לי כבר חשבון
      </button>
    </div>
  );
};

export default LoginRegister;
