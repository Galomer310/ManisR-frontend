import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Optional: If you have an icon at the top, import it here
// import heartIcon from "../assets/heartIcon.png";

const PreferencesLocation: React.FC = () => {
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [radius, setRadius] = useState(5);

  // Geolocation logic (unchanged)
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

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/preferences-food", { state: { city, radius } });
  };

  return (
    <div className="preferences-location-container" dir="rtl">
      {/* If you have a top icon or logo, you can uncomment and use this */}
      {/* <div className="top-icon">
        <img src={heartIcon} alt="Heart Icon" />
      </div> */}

      <form className="preferences-location-form" onSubmit={handleSubmit}>
        <label htmlFor="city" className="label">
          אזור מגורים
        </label>
        <input
          id="city"
          type="text"
          placeholder="תל אביב-יפו"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
          className="input-field"
        />

        <label htmlFor="radius" className="label">
          מרחק מיועד לאיסוף המזון
        </label>

        {/* Range Slider Row */}
        <div className="range-row">
          <span className="range-label">0 ק"מ</span>
          <input
            id="radius"
            type="range"
            min="0"
            max="10"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="range-slider"
          />
          <span className="range-label">10 ק"מ</span>
        </div>

        {/* Show current selected distance */}
        <p className="range-value">{radius} ק"מ</p>

        <button type="submit" className="confirm-btn">
          אישור
        </button>
      </form>
    </div>
  );
};

export default PreferencesLocation;
