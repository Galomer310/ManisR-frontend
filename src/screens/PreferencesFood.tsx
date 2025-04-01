import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const PreferencesFood: React.FC = () => {
  const navigate = useNavigate();
  // We assume city & radius are passed in from PreferencesLocation.
  const locationState = useLocation().state as { city: string; radius: number };
  const [foodPreference, setFoodPreference] = useState<string>("אין לי העדפות");
  const [allergies, setAllergies] = useState<string[]>([]);
  const [otherAllergy, setOtherAllergy] = useState("");

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  // Toggle a single food preference.
  const handleFoodPreferenceClick = (pref: string) => {
    setFoodPreference(pref);
  };

  // Toggle allergies.
  const handleAllergyClick = (value: string) => {
    if (allergies.includes(value)) {
      setAllergies(allergies.filter((a) => a !== value));
    } else {
      setAllergies([...allergies, value]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If user typed something in "otherAllergy", add it.
    const trimmedOther = otherAllergy.trim();
    let allergiesFinal = [...allergies];
    if (trimmedOther && !allergiesFinal.includes(trimmedOther)) {
      allergiesFinal.push(trimmedOther);
    }

    // Retrieve the userId from local storage.
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("No userId found in localStorage.");
      return;
    }

    // Build the payload. (Set phone to an empty string or retrieve it if available.)
    const payload = {
      userId,
      phone: "", // Include phone if available.
      city: locationState.city,
      radius: locationState.radius,
      foodPreference,
      allergies: allergiesFinal,
    };

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_BASE_URL}/preferences`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Preferences saved successfully.");
      // Navigate to the CollectFood screen after saving.
      navigate("/collect-food", { state: payload });
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };

  return (
    <div className="preferences-food-container" dir="rtl">
      <form className="preferences-food-form" onSubmit={handleSubmit}>
        <h2 className="title">מהן העדפות המזון שלך?</h2>
        <div className="food-btns-container">
          {["טבעוני", "צמחוני + דגים", "צמחוני", "כשר", "אין לי העדפות"].map(
            (pref) => (
              <button
                type="button"
                key={pref}
                className={`food-btn ${
                  foodPreference === pref ? "selected" : ""
                }`}
                onClick={() => handleFoodPreferenceClick(pref)}
              >
                {pref}
              </button>
            )
          )}
        </div>

        <h2 className="title">האם יש לך אלרגיה למזון מסוים?</h2>
        <div className="allergy-btns-container">
          {["גלוטן", "חלב", "ביצים", "אגוזים", "בוטנים", "אין לי אלרגיות"].map(
            (allergy) => (
              <button
                type="button"
                key={allergy}
                className={`allergy-btn ${
                  allergies.includes(allergy) ? "selected" : ""
                }`}
                onClick={() => handleAllergyClick(allergy)}
              >
                {allergy}
              </button>
            )
          )}
        </div>

        {/* "אחר" text field */}
        <div className="other-allergy">
          <label>אחר:</label>
          <input
            type="text"
            placeholder="ספר/י"
            value={otherAllergy}
            onChange={(e) => setOtherAllergy(e.target.value)}
          />
        </div>

        {/* Disclaimer Text */}
        <p className="disclaimer">
          *אחריות על הכנת המזון או איסופו היא בלעדית של המשתמש/ת. מומלץ לבדוק
          רכיבים או לבקש הבהרות מבעל המנה.
        </p>

        <button type="submit" className="finish-btn">
          סיימתי
        </button>
      </form>
    </div>
  );
};

export default PreferencesFood;
