// src/screens/CollectFood.tsx
import React, { useEffect, useState } from "react";
import Map, { Marker } from "react-map-gl";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "mapbox-gl/dist/mapbox-gl.css";
import locationIcon from "../assets/icons_ location.svg";
import manisrLogo from "../assets/manisr_logo.svg";
import { IoClose } from "react-icons/io5";
import { IoMenu } from "react-icons/io5";
import ProfileIcon from "../assets/icons_white_profile.svg";
import settingsIcon from "../assets/icosnd_ settings.svg";
import talkToUsIcon from "../assets/icons_ messages.svg";
import alertsIcon from "../assets/1 notification alert icon.svg";

interface Meal {
  id: number;
  user_id: number;
  item_description: string;
  pickup_address: string;
  box_option: "need" | "noNeed";
  food_types: string;
  ingredients: string;
  special_notes: string;
  lat: number;
  lng: number;
  meal_avatar?: string;
  user_avatar?: string;
  allergens?: string[]; // optional allergens array for filtering
}

// Define a minimal interface for Preferences
interface Preferences {
  radius: number;
  allergies: string[];
}

const CollectFood: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmTakeModalOpen, setConfirmTakeModalOpen] = useState(false);
  const [mealTaken] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [preferences, setPreferences] = useState<Preferences | null>(null);

  // The viewState for the map, initially centered at a default location.
  const [viewState, setViewState] = useState({
    latitude: 32.0853,
    longitude: 34.7818,
    zoom: 12,
  });

  const navigate = useNavigate();
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  const localUserId = Number(localStorage.getItem("userId"));

  // Fetch available meals.
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/food/available`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMeals(res.data.meals);
      } catch (err) {
        console.error("Server error fetching meals:", err);
      }
    };
    fetchMeals();
  }, [API_BASE_URL]);

  // Fetch taker's preferences from the backend.
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/preferences/${localUserId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          // Assume data.preferences contains a radius and an allergies string.
          if (data.preferences) {
            const prefs: Preferences = {
              radius: Number(data.preferences.radius),
              // Convert allergies string (if stored as comma-separated) to an array.
              allergies: data.preferences.allergies
                ? data.preferences.allergies
                    .split(",")
                    .map((s: string) => s.trim())
                : [],
            };
            setPreferences(prefs);
          }
        } else {
          console.error("Failed to fetch preferences");
        }
      } catch (error) {
        console.error("Error fetching preferences", error);
      }
    };
    if (localUserId) {
      fetchPreferences();
    }
  }, [API_BASE_URL, localUserId]);

  // Helper function: calculate distance using the Haversine formula.
  const getDistanceFromLatLonInKm = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // When a location search has been submitted, filter meals by distance and allergies.
  const filteredMeals =
    hasSearched && preferences
      ? meals.filter((meal) => {
          // Calculate distance from the searched location (viewState) to the meal.
          const distance = getDistanceFromLatLonInKm(
            viewState.latitude,
            viewState.longitude,
            meal.lat,
            meal.lng
          );
          const withinRadius = distance <= preferences.radius;
          // Check for allergy conflicts.
          const mealAllergens: string[] = meal.allergens || [];
          const allergyConflict = preferences.allergies.some((allergy) =>
            mealAllergens.includes(allergy)
          );
          return withinRadius && !allergyConflict;
        })
      : meals;

  // Handler for "Take a Meal" button.
  const handleTakeButtonClick = () => {
    if (!mealTaken) {
      setConfirmTakeModalOpen(true);
    }
  };

  // Handler for confirming "take" action.
  const handleConfirmTake = async () => {
    try {
      if (!selectedMeal) return;
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/food/reserve/${selectedMeal.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/TakerTracker", {
        state: {
          mealData: selectedMeal,
          reservationStart: Date.now(),
        },
      });
    } catch (err) {
      console.error("Error reserving meal:", err);
    }
  };

  const handleChat = () => {
    setConfirmTakeModalOpen(false);
    if (selectedMeal) {
      navigate("/messages", {
        state: {
          mealId: selectedMeal.id.toString(),
          role: "taker",
          otherPartyId: selectedMeal.user_id,
        },
      });
    }
  };

  // Dropdown overlay toggle and navigation functions.
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const goToProfile = () => navigate("/Profile");
  const goToSettings = () => navigate("/Settings");
  const goToTalkToUs = () => navigate("/TalkToUs");
  const goToMessages = () => navigate("/Messages");

  // Handle location search submission.
  const handleSearchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchQuery
        )}&format=json`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const firstResult = data[0];
        setViewState({
          latitude: parseFloat(firstResult.lat),
          longitude: parseFloat(firstResult.lon),
          zoom: 12,
        });
        setHasSearched(true);
      }
    } catch (error) {
      console.error("Location search error:", error);
    }
  };

  return (
    <div className="screen-container" style={{ position: "relative" }}>
      {/* Fixed Dropdown Menu Icon */}
      <div
        style={{ position: "fixed", top: "1rem", right: "1rem", zIndex: 1100 }}
      >
        <IoMenu
          size={32}
          color="black"
          onClick={toggleMenu}
          style={{ cursor: "pointer" }}
        />
      </div>

      {/* Fullscreen dropdown menu when open */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(114, 223, 114, 0.98)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1200,
          }}
        >
          <IoClose
            size={36}
            color="black"
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              cursor: "pointer",
            }}
            onClick={toggleMenu}
          />
          <div className="overLay-menu">
            <img
              src={ProfileIcon}
              alt="Profile"
              onClick={() => {
                toggleMenu();
                goToProfile();
              }}
            />
            <p>פרופיל אישי</p>
          </div>
          <div className="overLay-menu">
            <img
              src={alertsIcon}
              alt="Alerts"
              onClick={() => {
                toggleMenu();
                goToMessages();
              }}
            />
            <p>התראות</p>
          </div>
          <div className="overLay-menu">
            <img
              src={settingsIcon}
              alt="Settings"
              onClick={() => {
                toggleMenu();
                goToSettings();
              }}
            />
            <p>הגדרות</p>
          </div>
          <div className="overLay-menu">
            <img
              src={talkToUsIcon}
              alt="Talk To Us"
              onClick={() => {
                toggleMenu();
                goToTalkToUs();
              }}
            />
            <p>דבר איתנו</p>
          </div>
        </div>
      )}

      {/* Meal Summary Overlay for Taker */}
      {selectedMeal && selectedMeal.user_id !== localUserId && (
        <div
          className="mealCardTaker"
          style={{
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "90%",
            maxWidth: "500px",
            backgroundColor: "rgba(255,255,255,0.95)",
            padding: "1rem",
            boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
            zIndex: 1000,
            borderRadius: "8px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "row" }}>
            {/* Image area */}
            <div className="approvalCard">
              {selectedMeal.meal_avatar ? (
                (() => {
                  const fullImageUrl = new URL(
                    selectedMeal.meal_avatar,
                    API_BASE_URL
                  ).href;
                  return <img src={fullImageUrl} alt="Meal" />;
                })()
              ) : (
                <div>אין תמונה</div>
              )}
            </div>
            {/* Details area */}
            <div className="popupmealTaker" style={{ flex: "2" }}>
              <h3>{selectedMeal.item_description}</h3>
              <span>
                {selectedMeal.pickup_address}
                <img
                  src={locationIcon}
                  alt="location icon"
                  style={{ width: "1rem", height: "1rem" }}
                />
              </span>
              {/* "מתאים לי" button */}
              <button
                className="pickUpMeal"
                onClick={handleTakeButtonClick}
                disabled={mealTaken}
                style={{
                  backgroundColor: mealTaken ? "gray" : "",
                  cursor: mealTaken ? "not-allowed" : "pointer",
                }}
              >
                {mealTaken ? "אופס, כרגע שמור" : "מתאים לי"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Taker Action */}
      {confirmTakeModalOpen && (
        <div
          className="confirmation-modal"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1500,
          }}
        >
          <div className="modal-content">
            <h3 style={{ fontSize: "1.5rem" }}>
              המנה שמורה עבורך למשך 30 דקות
            </h3>
            <p>בחר/י בין לקחת את המנה לבין צ'אט עם מוסר/ת המנה.</p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                marginTop: "1rem",
              }}
            >
              <button className="greenBtn" onClick={handleConfirmTake}>
                לקחת
              </button>
              <button className="whiteBtn" onClick={handleChat}>
                צ'אט
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="map-container" style={{ height: "100vh" }}>
        <Map
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        >
          {filteredMeals.map((meal) => (
            <Marker
              key={meal.id}
              latitude={meal.lat}
              longitude={meal.lng}
              anchor="bottom"
            >
              <div
                id="location-logo"
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedMeal(meal)}
              >
                <img
                  src={manisrLogo}
                  alt="Meal Marker"
                  style={{ width: "30px", height: "30px", cursor: "pointer" }}
                />
              </div>
            </Marker>
          ))}
        </Map>
      </div>

      {/* Search Bar for Location Search */}
      <div
        style={{
          position: "absolute",
          bottom: "1rem",
          width: "100%",
          textAlign: "center",
        }}
      >
        <form
          onSubmit={handleSearchSubmit}
          style={{
            display: "inline-block",
            width: "90%",
            maxWidth: "400px",
          }}
        >
          <input
            type="text"
            placeholder="חפש מיקום..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: "0.5rem",
              width: "80%",
              borderRadius: "25px",
              border: "1px solid #ccc",
              textAlign: "right",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "25px",
              marginLeft: "0.5rem",
              border: "none",
              backgroundColor: "#479c47",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            חפש
          </button>
        </form>
      </div>
    </div>
  );
};

export default CollectFood;
