import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Map, { Marker } from "react-map-gl";
import locationIcon from "../assets/icons_ location.svg";
import boxIcon from "../assets/icons_ box.svg";
import alertIcon from "../assets/icons_ alert.svg";

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
  const [mapError, setMapError] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [, setMapLoaded] = useState(false);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  const MAPBOX_TOKEN =
    import.meta.env.VITE_MAPBOX_TOKEN || "YOUR_MAPBOX_ACCESS_TOKEN";

  useEffect(() => {
    if (imageFile) {
      const objectUrl = URL.createObjectURL(imageFile);
      setImagePreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [imageFile]);

  // Forward-geocode the pickup address using Mapbox
  useEffect(() => {
    if (!mealData.pickup_address) {
      setMapError("No address provided.");
      return;
    }
    const geocodeAddress = async (address: string) => {
      try {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          address
        )}.json?access_token=${MAPBOX_TOKEN}`;
        const res = await fetch(url);
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`Mapbox geocoding error: ${txt}`);
        }
        const data = await res.json();
        if (data.features && data.features.length > 0) {
          const [foundLng, foundLat] = data.features[0].geometry.coordinates;
          setLat(foundLat);
          setLng(foundLng);
          setMapError("");
        } else {
          setMapError("Could not find that address. Please correct it.");
        }
      } catch (err) {
        setMapError("Geocoding failed. Please correct your address.");
      }
    };
    geocodeAddress(mealData.pickup_address);
  }, [mealData.pickup_address, MAPBOX_TOKEN]);

  const handleApprove = async () => {
    try {
      setError("");
      if (!lat || !lng) {
        setError("Please correct the address before continuing.");
        return;
      }
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
      formData.append("lat", String(lat));
      formData.append("lng", String(lng));
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

  const handleGoBackToEdit = () => {
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
    <div className="screen-container GiverApprovalCard">
      <div className="foodSummeryCardApproval">
        {imagePreviewUrl ? (
          <img src={imagePreviewUrl} alt="Meal Preview" />
        ) : (
          <p>אין תמונה להצגה</p>
        )}
        <p>
          <strong>{mealData.item_description}</strong>
        </p>
        <span>
          {mealData.pickup_address}
          <img src={locationIcon} />
        </span>
        <span>
          <p>
            מכיל {mealData.ingredients} <img src={alertIcon} />
          </p>
        </span>

        <p>
          {mealData.box_option === "need"
            ? "צריך להביא קופסא"
            : " לא צריך להביא קופסא"}
          <img src={boxIcon} />
        </p>

        <p>
          <strong>:הערות מיוחדות</strong>
        </p>
        <p>{mealData.special_notes}</p>
      </div>

      {mapError ? (
        <p style={{ color: "red" }}>{mapError}</p>
      ) : lat && lng ? (
        <div className="approvalMealMap">
          <Map
            initialViewState={{
              latitude: lat,
              longitude: lng,
              zoom: 14,
            }}
            style={{ width: "100%", height: "100%" }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            mapboxAccessToken={MAPBOX_TOKEN}
            onLoad={() => setMapLoaded(true)}
          >
            <Marker latitude={lat} longitude={lng}>
              <div style={{ fontSize: "2rem" }}>📍</div>
            </Marker>
          </Map>
        </div>
      ) : (
        <p>Loading map preview...</p>
      )}

      {error && <p className="error">{error}</p>}

      <div className="giverMealCardApproval">
        <p>? האם כל הפרטים נכונים </p>
        <button className="greenBtn" onClick={handleApprove}>
          אישור
        </button>
        <button className="whiteBtn" onClick={handleGoBackToEdit}>
          חזור
        </button>
      </div>
    </div>
  );
};

export default GiverMealCardApproval;
