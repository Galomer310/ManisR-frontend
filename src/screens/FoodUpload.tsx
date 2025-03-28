// src/screens/FoodUpload.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface MealData {
  id?: number; // Optional ID for editing
  item_description: string;
  pickup_address: string;
  box_option: "need" | "noNeed";
  food_types: string;
  ingredients: string;
  special_notes: string;
  lat?: number; // Latitude for geolocation
  lng?: number; // Longitude for geolocation
}

const FoodUpload: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editMeal: MealData | null = location.state?.meal || null;

  // Basic text fields:
  const [itemDescription, setItemDescription] = useState(
    editMeal?.item_description || ""
  );
  const [pickupAddress, setPickupAddress] = useState(
    editMeal?.pickup_address || ""
  );
  const [boxOption, setBoxOption] = useState<"need" | "noNeed">(
    editMeal?.box_option || "need"
  );
  const [selectedFoodTypes, setSelectedFoodTypes] = useState<string[]>(
    editMeal?.food_types ? editMeal.food_types.split(",") : []
  );
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>(
    editMeal?.ingredients ? editMeal.ingredients.split(",") : []
  );
  const [specialNotes, setSpecialNotes] = useState(
    editMeal?.special_notes || ""
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number }>({
    lat: 0,
    lng: 0,
  });

  const geocodeAddress = async (
    address: string
  ): Promise<{ lat: number; lng: number } | null> => {
    try {
      const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        address
      )}.json?access_token=${mapboxToken}`;

      const res = await fetch(url);
      if (!res.ok) {
        console.error("Mapbox geocoding error:", await res.text());
        return null;
      }
      const data = await res.json();

      // Each result has geometry.coordinates = [lng, lat]
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].geometry.coordinates;
        return { lat, lng };
      }
      // No geocoding result
      return null;
    } catch (error) {
      console.error("Mapbox geocoding error:", error);
      return null;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // Helper function for toggling selections.
  const toggleSelection = (
    value: string,
    selected: string[],
    setSelected: (arr: string[]) => void
  ) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  // Instead of submitting directly, navigate to the approval page.
  const handlePreview = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    let lat = userCoords.lat;
    let lng = userCoords.lng;

    // If user typed an address and hasn't used geolocation, we geocode:
    if (pickupAddress && pickupAddress !== "Using current location") {
      const coords = await geocodeAddress(pickupAddress);
      if (coords) {
        lat = coords.lat;
        lng = coords.lng;
        console.log("DEBUG lat/lng before navigating:", { lat, lng });
      } else {
        // If geocode fails, you might want to show an error or fallback
        console.warn("Geocoding failed or no result.");
      }
    }

    // Build the meal data:
    const mealData: MealData = {
      id: editMeal?.id,
      item_description: itemDescription,
      pickup_address: pickupAddress,
      box_option: boxOption,
      food_types: selectedFoodTypes.join(","),
      ingredients: selectedIngredients.join(","),
      special_notes: specialNotes,
      lat,
      lng,
    };

    navigate("/giver-meal-card-approval", {
      state: { mealData, imageFile, isEdit: !!editMeal },
    });
  };

  return (
    <div className="screen-container upload-food">
      <h2>{editMeal ? "Edit Your Meal" : "Upload Your Meal"}</h2>
      <form onSubmit={handlePreview} autoComplete="off">
        <label htmlFor="itemDescription">אני רוצה למסור</label>
        <input
          type="text"
          placeholder="פסטה ברוטב עגבניות"
          value={itemDescription}
          onChange={(e) => setItemDescription(e.target.value)}
          required
        />

        <label htmlFor="pickupAddress">כתובת לאיסוף</label>
        <input
          type="text"
          placeholder="ביאליק 115 רמת גן"
          value={pickupAddress}
          onChange={(e) => setPickupAddress(e.target.value)}
          required
        />
        <button
          type="button"
          onClick={async () => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (pos) => {
                  setUserCoords({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                  });
                  // Also override pickupAddress with something like "Current Location"
                  setPickupAddress("Using current location");
                },
                (err) => {
                  console.error("Geolocation error:", err);
                }
              );
            }
          }}
        >
          Use My Current Location
        </button>

        <div>
          <p>בחר/י את האפשרות המתאימה (קופסא)</p>
          <button
            type="button"
            className={boxOption === "need" ? "selected" : ""}
            onClick={() => setBoxOption("need")}
          >
            צריך להביא קופסא
          </button>
          <button
            type="button"
            className={boxOption === "noNeed" ? "selected" : ""}
            onClick={() => setBoxOption("noNeed")}
          >
            לא צריך להביא קופסא
          </button>
        </div>

        <div>
          <p>בחר/י סוג אוכל (אופציונלי, ניתן לבחור יותר מאחד)</p>
          <button
            type="button"
            className={selectedFoodTypes.includes("כשר") ? "selected" : ""}
            onClick={() =>
              toggleSelection("כשר", selectedFoodTypes, setSelectedFoodTypes)
            }
          >
            כשר
          </button>
          <button
            type="button"
            className={selectedFoodTypes.includes("צמחוני") ? "selected" : ""}
            onClick={() =>
              toggleSelection("צמחוני", selectedFoodTypes, setSelectedFoodTypes)
            }
          >
            צמחוני
          </button>
          <button
            type="button"
            className={selectedFoodTypes.includes("טבעוני") ? "selected" : ""}
            onClick={() =>
              toggleSelection("טבעוני", selectedFoodTypes, setSelectedFoodTypes)
            }
          >
            טבעוני
          </button>
          <button
            type="button"
            className={
              selectedFoodTypes.includes("צמחוני + דגים") ? "selected" : ""
            }
            onClick={() =>
              toggleSelection(
                "צמחוני + דגים",
                selectedFoodTypes,
                setSelectedFoodTypes
              )
            }
          >
            צמחוני + דגים
          </button>
        </div>

        <div>
          <p>בחר/י מרכיבים (אופציונלי, ניתן לבחור יותר מאחד)</p>
          <button
            type="button"
            className={selectedIngredients.includes("חלב") ? "selected" : ""}
            onClick={() =>
              toggleSelection(
                "חלב",
                selectedIngredients,
                setSelectedIngredients
              )
            }
          >
            חלב
          </button>
          <button
            type="button"
            className={selectedIngredients.includes("ביצים") ? "selected" : ""}
            onClick={() =>
              toggleSelection(
                "ביצים",
                selectedIngredients,
                setSelectedIngredients
              )
            }
          >
            ביצים
          </button>
          <button
            type="button"
            className={selectedIngredients.includes("אגוזים") ? "selected" : ""}
            onClick={() =>
              toggleSelection(
                "אגוזים",
                selectedIngredients,
                setSelectedIngredients
              )
            }
          >
            אגוזים
          </button>
          <button
            type="button"
            className={selectedIngredients.includes("קמח") ? "selected" : ""}
            onClick={() =>
              toggleSelection(
                "קמח",
                selectedIngredients,
                setSelectedIngredients
              )
            }
          >
            קמח
          </button>
          <button
            type="button"
            className={selectedIngredients.includes("גלוטן") ? "selected" : ""}
            onClick={() =>
              toggleSelection(
                "גלוטן",
                selectedIngredients,
                setSelectedIngredients
              )
            }
          >
            גלוטן
          </button>
        </div>

        <div className="special-notes">
          <p>הערות מיוחדות</p>
          <textarea
            value={specialNotes}
            onChange={(e) => setSpecialNotes(e.target.value)}
          />
        </div>

        <div className="file-upload">
          <label htmlFor="foodImage">צרפ/י תמונה של המנה</label>
          <input
            id="foodImage"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit">
          {editMeal ? "צפייה בעדכון" : "צפייה מקדימה"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default FoodUpload;
