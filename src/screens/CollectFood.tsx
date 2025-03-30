import React, { useEffect, useState } from "react";
import Map, { Marker } from "react-map-gl";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "mapbox-gl/dist/mapbox-gl.css";
import locationIcon from "../assets/location.png";
import manisrLogo from "../assets/manisr_logo.svg";

// Dropdown overlay icons – ensure these paths match your project.
import ProfileIcon from "../assets/icons_ profile.svg";
import settingsIcon from "../assets/icosnd_ settings.svg";
import talkToUsIcon from "../assets/icons_ messages.svg";
import alertsIcon from "../assets/1 notification alert icon.svg";

interface Meal {
  id: number;
  item_description: string;
  pickup_address: string;
  box_option: "need" | "noNeed";
  food_types: string;
  ingredients: string;
  special_notes: string;
  lat: number;
  lng: number;
  avatar_url: string;
  user_id: number; // giver's id
}

const CollectFood: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  // New state for the "take" confirmation modal and to track if the meal is taken
  const [confirmTakeModalOpen, setConfirmTakeModalOpen] = useState(false);
  const [mealTaken] = useState(false);
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

  // Handler for when taker clicks on "מתאים לי" button.
  const handleTakeButtonClick = () => {
    if (!mealTaken) {
      setConfirmTakeModalOpen(true);
    }
  };

  // Handler when taker confirms "Yes, I want to take".
  const handleConfirmTake = async () => {
    try {
      if (!selectedMeal) return;
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/food/reserve/${selectedMeal.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // The backend now sets status='reserved', so the meal won't show
      // for other Takers. Next, navigate to TakerTracker with the data:
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

  // Handler when taker chooses "Chat" instead of confirming.
  const handleChat = () => {
    setConfirmTakeModalOpen(false);
    if (selectedMeal) {
      navigate("/messages", {
        state: {
          mealId: selectedMeal.id.toString(),
          role: "taker",
          otherPartyId: selectedMeal.user_id, // Giver’s ID
        },
      });
    }
  };

  // Dropdown overlay toggle.
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  // Navigation functions for dropdown overlay.
  const goToProfile = () => navigate("/Profile");
  const goToSettings = () => navigate("/Settings");
  const goToTalkToUs = () => navigate("/TalkToUs");

  return (
    <div className="screen-container" style={{ position: "relative" }}>
      {/* Fixed Dropdown Menu Icon */}
      <div
        style={{ position: "fixed", top: "1rem", right: "1rem", zIndex: 1100 }}
      >
        <div onClick={toggleMenu} style={{ cursor: "pointer" }}>
          <div
            style={{
              width: "25px",
              height: "3px",
              backgroundColor: "black",
              margin: "4px 0",
            }}
          ></div>
          <div
            style={{
              width: "25px",
              height: "3px",
              backgroundColor: "black",
              margin: "4px 0",
            }}
          ></div>
          <div
            style={{
              width: "25px",
              height: "3px",
              backgroundColor: "black",
              margin: "4px 0",
            }}
          ></div>
        </div>
      </div>

      {/* Dropdown Menu Overlay */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(114,223,114,0.98)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1100,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              cursor: "pointer",
            }}
            onClick={toggleMenu}
          >
            <div
              style={{
                width: "25px",
                height: "3px",
                backgroundColor: "black",
                margin: "4px 0",
              }}
            ></div>
            <div
              style={{
                width: "25px",
                height: "3px",
                backgroundColor: "black",
                margin: "4px 0",
              }}
            ></div>
            <div
              style={{
                width: "25px",
                height: "3px",
                backgroundColor: "black",
                margin: "4px 0",
              }}
            ></div>
          </div>
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
                goToTalkToUs();
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
            <div style={{ flex: "1", textAlign: "center" }}>
              {selectedMeal.avatar_url ? (
                <img
                  src={selectedMeal.avatar_url}
                  alt="Meal"
                  style={{
                    width: "100%",
                    maxWidth: "150px",
                    borderRadius: "8px",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "150px",
                    backgroundColor: "#eee",
                  }}
                >
                  אין תמונה
                </div>
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
          initialViewState={{ latitude: 32.0853, longitude: 34.7818, zoom: 12 }}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        >
          {meals.map((meal) => (
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
    </div>
  );
};

export default CollectFood;
