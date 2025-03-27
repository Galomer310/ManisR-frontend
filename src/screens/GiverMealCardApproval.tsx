// src/screens/GiverMealCardApproval.tsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface MealData {
  id?: number;
  item_description: string;
  pickup_address: string;
  box_option: "need" | "noNeed";
  food_types: string;
  ingredients: string;
  special_notes: string;
}

const GiverMealCardApproval: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mealData, imageFile, isEdit } = location.state as {
    mealData: MealData;
    imageFile: File | null;
    isEdit: boolean;
  };

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    if (imageFile) {
      const objectUrl = URL.createObjectURL(imageFile);
      setImagePreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [imageFile]);

  // Submit the meal to the server.
  const handleApprove = async () => {
    try {
      setError("");
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("No userId found. Please log in first.");
        return;
      }
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("itemDescription", mealData.item_description);
      formData.append("pickupAddress", mealData.pickup_address);
      formData.append("boxOption", mealData.box_option);
      formData.append("foodTypes", mealData.food_types);
      formData.append("ingredients", mealData.ingredients);
      formData.append("specialNotes", mealData.special_notes);
      formData.append("userId", userId);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      let response;
      if (isEdit) {
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

  const handleGoBack = () => {
    navigate("/food/upload", {
      state: {
        meal: {
          id: mealData.id,
          item_description: mealData.item_description,
          pickup_address: mealData.pickup_address,
          box_option: mealData.box_option,
          food_types: mealData.food_types,
          ingredients: mealData.ingredients,
          special_notes: mealData.special_notes,
        },
      },
    });
  };

  return (
    <div className="screen-container" style={{ textAlign: "right" }}>
      <h2>אישור המנה</h2>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        {imagePreviewUrl ? (
          <img
            src={imagePreviewUrl}
            alt="Meal Preview"
            style={{ width: "100%", maxWidth: "300px", marginBottom: "1rem" }}
          />
        ) : (
          <p>אין תמונה להצגה</p>
        )}
        <p>
          <strong>שם המנה:</strong> {mealData.item_description}
        </p>
        <p>
          <strong>כתובת לאיסוף:</strong> {mealData.pickup_address}
        </p>
        <p>
          <strong>צריך להביא קופסא:</strong>{" "}
          {mealData.box_option === "need" ? "כן" : "לא"}
        </p>
        <p>
          <strong>סוגי אוכל:</strong> {mealData.food_types}
        </p>
        <p>
          <strong>מרכיבים:</strong> {mealData.ingredients}
        </p>
        <p>
          <strong>הערות מיוחדות:</strong> {mealData.special_notes}
        </p>
      </div>
      {error && <p className="error">{error}</p>}
      <button onClick={handleApprove}>אישור סופי</button>
      <button onClick={handleGoBack}>חזור לעריכה</button>
    </div>
  );
};

export default GiverMealCardApproval;
