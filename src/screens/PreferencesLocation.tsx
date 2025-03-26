// src/screens/PreferencesLocation.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PreferencesLocation: React.FC = () => {
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [radius, setRadius] = useState(5);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
            );
            const data = await response.json();
            if (data && data.address) {
              const suggestedCity =
                data.address.city ||
                data.address.town ||
                data.address.village ||
                data.address.county ||
                "";
              if (suggestedCity) {
                setCity(suggestedCity);
              }
            }
          } catch (error) {
            console.error("Reverse geocoding error:", error);
          }
        },
        (err) => {
          console.error("Geolocation error:", err);
        }
      );
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/preferences/food", { state: { city, radius } });
  };

  return (
    <div className="screen-container">
      <h2>Location Preferences</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <label htmlFor="city">City:</label>
        <input
          id="city"
          type="text"
          placeholder="Enter your city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
        <label htmlFor="radius">Search Radius: {radius} km</label>
        <input
          id="radius"
          type="range"
          min="1"
          max="10"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
        />
        <button type="submit">Next</button>
      </form>
    </div>
  );
};

export default PreferencesLocation;
