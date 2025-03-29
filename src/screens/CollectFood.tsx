// src/screens/CollectFood.tsx
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

  // When a taker clicks on a meal marker, navigate to TakerMealCardApproval.
  const handleViewMealPost = (meal: Meal) => {
    navigate("/taker-meal-card-approval", {
      state: { mealData: meal, imageFile: null, role: "taker" },
    });
  };

  // Function to check if the taker already started a conversation.
  // It calls the /messages/myConversations endpoint.
  const goToMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/messages/myConversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const conversations = res.data.conversations;
      if (conversations && conversations.length > 0) {
        // For simplicity, navigate to the first conversation.
        // We assume that conversation_id can be used as the identifier for the conversation.
        const conversationId = conversations[0].conversation_id;
        navigate("/messages", {
          state: { mealId: conversationId, role: "taker" },
        });
      } else {
        alert(
          "You haven't started any conversation. Please click on a meal icon and send the first message."
        );
      }
    } catch (err) {
      console.error("Error fetching conversations:", err);
      alert("Error fetching your conversations. Please try again later.");
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
      {/* Fixed Burger Menu Icon */}
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
              alt="Messages"
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
              <a onClick={() => handleViewMealPost(selectedMeal)}>
                View Meal Post
              </a>
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
            <Marker key={meal.id} latitude={meal.lat} longitude={meal.lng}>
              <div
                id="location-logo"
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedMeal(meal)}
              >
                <img
                  src={manisrLogo}
                  alt="Meal Marker"
                  style={{ width: "30px", height: "30px", cursor: "pointer" }}
                  onClick={() => setSelectedMeal(meal)}
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
