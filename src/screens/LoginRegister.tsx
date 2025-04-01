import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/manisr_logo.svg";

const LoginRegister: React.FC = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate("/register-intro");
  };

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
      <button className="registerBtn" onClick={handleRegisterClick}>
        הרשמה
      </button>
      <button
        className="alreadyRegisterBtn"
        id="already-register"
        onClick={handleLoginClick}
      >
        יש לי כבר חשבון
      </button>
    </div>
  );
};

export default LoginRegister;
