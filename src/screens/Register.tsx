import React, { useState } from "react";
import logo from "../assets/MNSR_logo.svg";
/**
 * Register screen:
 * Collects name, username, email, password, and gender,
 * then calls /auth/register.
 */
const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState(""); // NEW state for gender
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      // Send all fields (including gender) to your backend
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, username, email, password, gender }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Registration failed.");
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      console.error(err);
      setError("Server error during registration.");
    }
  };

  return (
    <div className="screen-container register-container">
      <img src={logo} />
      <form onSubmit={handleSubmit} autoComplete="off">
        <label htmlFor="name"> ? מה השם שלך </label>
        <input
          type="text"
          id="name"
          placeholder="ישראלה ישראלי"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label htmlFor="username">בחר/י שם משתמש</label>
        <input
          type="text"
          id="username"
          placeholder="ישראלה"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="email">? מה המייל שלך</label>
        <input
          type="email"
          id="email"
          placeholder="israela123@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="register-gender">
          <label>? מה המגדר שלך</label>
          <div className="gender-buttons">
            <button
              type="button"
              className={gender === "male" ? "selected" : ""}
              onClick={() => setGender("male")}
            >
              גבר
            </button>
            <button
              type="button"
              className={gender === "female" ? "selected" : ""}
              onClick={() => setGender("female")}
            >
              אישה
            </button>
            <button
              type="button"
              className={gender === "other" ? "selected" : ""}
              onClick={() => setGender("other")}
            >
              אחר
            </button>
          </div>
        </div>

        <div className="register-input">
          <label htmlFor="password">בחר/י סיסמה</label>
          <input
            type="password"
            id="password"
            placeholder=""
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <p>הסיסמה חייבת לכלול 8 תווים, לפחות ספרה אחת ולפחות אות אחת *</p>
        <button id="approveBtn" type="submit">
          אישור
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
};

export default Register;
