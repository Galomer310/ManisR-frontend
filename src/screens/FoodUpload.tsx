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
}

const FoodUpload: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editMeal: MealData | null = location.state?.meal || null;

  const [itemDescription, setItemDescription] = useState(
    editMeal?.item_description || ""
  );
  const [pickupAddress, setPickupAddress] = useState(
    editMeal?.pickup_address || ""
  );
  const [boxOption, setBoxOption] = useState<"need" | "noNeed">(
    editMeal?.box_option || "need"
  );
  const [foodTypes, setFoodTypes] = useState<string[]>(
    editMeal ? editMeal.food_types.split(",") : []
  );
  const [ingredients] = useState<string[]>(
    editMeal ? editMeal.ingredients.split(",") : []
  );
  const [specialNotes] = useState(editMeal?.special_notes || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  // Use device geolocation to suggest an address if not editing.
  useEffect(() => {
    if (!editMeal && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
            );
            const data = await response.json();
            if (data && data.display_name) {
              setPickupAddress(data.display_name);
            }
          } catch (err) {
            console.error("Reverse geocoding error:", err);
          }
        },
        (err) => {
          console.error("Geolocation error:", err);
        }
      );
    }
  }, [editMeal]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleCancel = async () => {
    // If editing and meal has an ID, try deleting it.
    if (editMeal?.id) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/food/myMeal`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Error deleting meal");
          return;
        }
      } catch (err) {
        console.error(err);
        setError("Server error deleting meal");
        return;
      }
    }
    navigate("/menu");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("No userId found. Please log in first.");
      return;
    }
    const formData = new FormData();
    formData.append("itemDescription", itemDescription);
    formData.append("pickupAddress", pickupAddress);
    formData.append("boxOption", boxOption);
    formData.append("foodTypes", foodTypes.join(","));
    formData.append("ingredients", ingredients.join(","));
    formData.append("specialNotes", specialNotes);
    formData.append("userId", userId);
    if (imageFile) {
      formData.append("image", imageFile);
    }
    try {
      const token = localStorage.getItem("token");
      let response;
      if (editMeal) {
        response = await fetch(`${API_BASE_URL}/food/myMeal`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      } else {
        response = await fetch(`${API_BASE_URL}/food/give`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      }
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Error uploading food item");
      } else {
        navigate("/giver-meal-screen");
      }
    } catch (err) {
      console.error(err);
      setError("Server error during food upload");
    }
  };

  return (
    <div className="screen-container">
      <h2>{editMeal ? "Edit Your Meal" : "Upload Food Item"}</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <input
          type="text"
          placeholder="Description of the food item"
          value={itemDescription}
          onChange={(e) => setItemDescription(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Pickup Address"
          value={pickupAddress}
          onChange={(e) => setPickupAddress(e.target.value)}
          required
        />
        <div>
          <p>Do you need to bring a box?</p>
          <label>
            <input
              type="radio"
              name="boxOption"
              value="need"
              checked={boxOption === "need"}
              onChange={() => setBoxOption("need")}
            />
            Need to bring box
          </label>
          <label>
            <input
              type="radio"
              name="boxOption"
              value="noNeed"
              checked={boxOption === "noNeed"}
              onChange={() => setBoxOption("noNeed")}
            />
            No need
          </label>
        </div>
        <div>
          <p>Select food types:</p>
          <label>
            <input
              type="checkbox"
              value="Kosher vegetarian"
              onChange={(e) => {
                if (e.target.checked) {
                  setFoodTypes((prev) => [...prev, "Kosher vegetarian"]);
                } else {
                  setFoodTypes((prev) =>
                    prev.filter((ft) => ft !== "Kosher vegetarian")
                  );
                }
              }}
              checked={foodTypes.includes("Kosher vegetarian")}
            />
            Kosher vegetarian
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              value="Vegan"
              onChange={(e) => {
                if (e.target.checked) {
                  setFoodTypes((prev) => [...prev, "Vegan"]);
                } else {
                  setFoodTypes((prev) => prev.filter((ft) => ft !== "Vegan"));
                }
              }}
              checked={foodTypes.includes("Vegan")}
            />
            Vegan
          </label>
        </div>
        <div>
          <label htmlFor="foodImage">Upload Image (optional):</label>
          <input
            id="foodImage"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit">
          {editMeal ? "Update Meal" : "Upload Food"}
        </button>
      </form>
      <button type="button" onClick={handleCancel}>
        Cancel
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default FoodUpload;
