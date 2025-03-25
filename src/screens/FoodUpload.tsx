// src/screens/FoodUpload.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * FoodUpload screen:
 * Allows a giver to upload food details (and optionally an image).
 * The request includes an Authorization header with the JWT token.
 */
const FoodUpload: React.FC = () => {
  const navigate = useNavigate();
  const [itemDescription, setItemDescription] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [boxOption, setBoxOption] = useState<"need" | "noNeed">("need");
  const [foodTypes, setFoodTypes] = useState<string[]>([]);
  const [ingredients] = useState<string[]>([]);
  const [specialNotes] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
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
      const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
      // Retrieve JWT token from localStorage
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/food/give`, {
        method: "POST",
        headers: {
          // Include Authorization header for protected endpoint
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Error uploading food item");
      } else {
        // Navigate to home after a successful upload.
        navigate("/home");
      }
    } catch (err) {
      console.error(err);
      setError("Server error during food upload");
    }
  };

  return (
    <div className="screen-container">
      <h2>Upload Food Item</h2>
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
              onChange={() =>
                setFoodTypes((prev) => [...prev, "Kosher vegetarian"])
              }
            />
            Kosher vegetarian
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              value="Vegan"
              onChange={() => setFoodTypes((prev) => [...prev, "Vegan"])}
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
        <button type="submit">Upload Food</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default FoodUpload;
