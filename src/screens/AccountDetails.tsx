import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import axios from "axios";

const AccountDetails: React.FC = () => {
  const navigate = useNavigate();
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");
  const [radius, setRadius] = useState(5);
  const [foodPreference, setFoodPreference] = useState("צמחוני");
  const [allergies, setAllergies] = useState<string[]>([]);

  const handleToggleAllergy = (value: string) => {
    if (allergies.includes(value)) {
      setAllergies(allergies.filter((a) => a !== value));
    } else {
      setAllergies([...allergies, value]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Prepare the data to send
    const userPreferences = {
      phone: phoneNumber,
      city,
      radius,
      foodPreference,
      allergies,
    };

    try {
      const token = localStorage.getItem("token");
      // Send POST request to backend endpoint
      const response = await axios.post(
        `${API_BASE_URL}/user_preferences`,
        userPreferences,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("User preferences saved:", response.data);
      // Optionally navigate or show a success message
      navigate("/menu"); // or any other page you want to go to after saving
    } catch (error) {
      console.error("Error saving user preferences:", error);
    }
  };

  return (
    <div className="screen-container account-details-container">
      {/* Clickable Back Icon at Top Right */}
      <div
        style={{
          position: "fixed",
          top: "1rem",
          right: "1rem",
          cursor: "pointer",
          zIndex: 1200,
        }}
        onClick={() => navigate(-1)}
      >
        <IoIosArrowForward size={24} color="black" />
      </div>

      <h2>פרטי חשבון</h2>

      <form onSubmit={handleSubmit} autoComplete="off">
        {/* Phone Number */}
        <label htmlFor="phone">מספר הטלפון שלך</label>
        <input
          id="phone"
          type="text"
          placeholder="050-5589634"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />

        {/* City */}
        <label htmlFor="city">אזור מגורים</label>
        <select
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        >
          <option value="">בחר עיר</option>
          <option value="Tel Aviv-Yafo">תל אביב-יפו</option>
          <option value="Ramat gan">רמת גן</option>
          <option value="Rishon LeZion">ראשון לציון</option>
          <option value="Streets">רחובות</option>
          <option value="Jerusalem">ירושלים</option>
          <option value="Petah tikva">פתח תקווה</option>
          <option value="Haifa">חיפה</option>
          <option value="Ashdod">אשדוד</option>
          <option value="Ashkelon">אשקלון</option>
          <option value="Holon">חולון</option>
          <option value="Afula">עפולה</option>
          <option value="Tiberias">טבריה</option>
          <option value="Kiryat Shmona">קריית שמונה</option>
          <option value="Netanya">נתניה</option>
          <option value="Hadera">חדרה</option>
          <option value="Beer Sheva">באר שבע</option>
          <option value="Eilat">אילת</option>
        </select>

        {/* Radius */}
        <label htmlFor="radius">מרחק מיועד לאיסוף המזון</label>
        <span className="range-value">{radius} km</span>
        <input
          id="radius"
          type="range"
          min="1"
          max="10"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
        />

        {/* Food Preferences */}
        <label>העדפות המזון שלך</label>
        <div className="food-preference-buttons">
          {["טבעוני", "אין לי העדפות", "צמחוני + דגים", "צמחוני", "כשר"].map(
            (pref) => (
              <button
                key={pref}
                type="button"
                className={`food-btn ${
                  foodPreference === pref ? "selected" : ""
                }`}
                onClick={() => setFoodPreference(pref)}
              >
                {pref}
              </button>
            )
          )}
        </div>

        {/* Allergies */}
        <label>אלרגיות שלך</label>
        <div className="allergy-buttons">
          {[
            "גלוטן",
            "חלב",
            "ביצים",
            "אחר",
            "אגוזים",
            "בוטנים",
            "אין לי אלרגיות",
          ].map((allergy) => (
            <button
              key={allergy}
              type="button"
              className={`allergy-btn ${
                allergies.includes(allergy) ? "selected" : ""
              }`}
              onClick={() => handleToggleAllergy(allergy)}
            >
              {allergy}
            </button>
          ))}
        </div>

        {/* Save / Cancel Buttons */}
        <div className="buttons-row">
          <button type="button" className="cancel-btn">
            בטל
          </button>
          <button type="submit" className="save-btn">
            שמור
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountDetails;
