// src/screens/FoodUpload.tsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

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

  // Basic text fields – required: item_description (meal name) and pickup_address (address)
  const [itemDescription, setItemDescription] = useState(
    editMeal?.item_description || ""
  );
  const [pickupAddress, setPickupAddress] = useState(
    editMeal?.pickup_address || ""
  );
  // Default box_option is "need"
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

  // On form submit, ensure required fields are provided and navigate to approval page.
  const handlePreview = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!itemDescription.trim() || !pickupAddress.trim()) {
      setError("Meal name and address are required.");
      return;
    }

    const mealData: MealData = {
      id: editMeal?.id,
      item_description: itemDescription,
      pickup_address: pickupAddress,
      box_option: boxOption,
      food_types: selectedFoodTypes.join(","),
      ingredients: selectedIngredients.join(","),
      special_notes: specialNotes,
    };

    navigate("/giver-meal-card-approval", {
      state: { mealData, imageFile, isEdit: !!editMeal },
    });
  };

  return (
    <div className="screen-container upload-food">
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
        <FaArrowRight size={24} color="black" />
      </div>

      <form onSubmit={handlePreview} autoComplete="off">
        <label htmlFor="itemDescription">אני רוצה למסור </label>
        <input
          type="text"
          placeholder="Enter meal name"
          value={itemDescription}
          onChange={(e) => setItemDescription(e.target.value)}
          required
        />

        <label htmlFor="pickupAddress">כתובת לאיסוף</label>
        <input
          type="text"
          placeholder="Enter pickup address"
          value={pickupAddress}
          onChange={(e) => setPickupAddress(e.target.value)}
          required
        />

        <div>
          <p>בחר/י את האפשרות המתאימה</p>
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
          <p>סמן/י אם רלוונטי למנה</p>
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
          <p>סמן/י אם אחד או יותר מהמרכיבים נמצאים במנה</p>
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

        <button id="approvedMeal" type="submit">
          {editMeal ? "צפייה בעדכון" : "אישור"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default FoodUpload;
