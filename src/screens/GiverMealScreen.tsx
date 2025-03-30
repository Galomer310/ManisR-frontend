import React, { useEffect, useState } from "react";
import Map, { Marker } from "react-map-gl";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "mapbox-gl/dist/mapbox-gl.css";
import manisrLogo from "../assets/manisr_logo.svg";
import locationIcon from "../assets/location.png";
import ProfileIcon from "../assets/icons_ profile.svg";
import settingsIcon from "../assets/icosnd_ settings.svg";
import talkToUsIcon from "../assets/icons_ messages.svg";
import alertsIcon from "../assets/1 notification alert icon.svg";

// 1) IMPORT SOCKET.IO CLIENT
import { io } from "socket.io-client";

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
  user_id: number;
}

const GiverMealScreen: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  const localUserId = Number(localStorage.getItem("userId"));

  // 2) CREATE A SOCKET CONNECTED TO YOUR BACKEND
  //    In real projects, you might do this at a higher level (e.g., App.tsx),
  //    but here we do it inline for clarity.
  const socket = io(API_BASE_URL, {
    transports: ["websocket"],
    autoConnect: false,
  });

  // Load available meals once
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
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, [API_BASE_URL]);

  // 3) HOOK UP SOCKET LISTENERS
  useEffect(() => {
    socket.connect(); // connect the socket

    // On connect
    socket.on("connect", () => {
      console.log("GiverMealScreen: connected to socket", socket.id);
    });

    // Listen for "mealReserved" with the ENTIRE meal object
    socket.on("mealReserved", (payload: any) => {
      console.log("GiverMealScreen: received mealReserved event:", payload);
      // payload: { meal: { ... }, reservedAt, expiresAt, etc. }

      // Check if this meal belongs to me by comparing meal.user_id to localUserId
      if (payload.meal && payload.meal.user_id === localUserId) {
        // Navigate to GiverTracker with the ENTIRE meal object
        navigate("/GiverTracker", {
          state: {
            mealData: payload.meal, // Pass the full meal
            reservationStart: Date.now(),
          },
        });
      }
    });

    // On disconnect
    socket.on("disconnect", () => {
      console.log("GiverMealScreen: disconnected from socket");
    });

    // Cleanup listeners when unmounting
    return () => {
      socket.off("connect");
      socket.off("mealReserved");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, [socket, localUserId, navigate]);

  // --- YOUR EXISTING CODE BELOW ---

  const handleConfirmCancel = async () => {
    if (!selectedMeal) return;
    try {
      const token = localStorage.getItem("token");
      // Delete my meal
      await axios.delete(`${API_BASE_URL}/food/myMeal`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Delete conversation if any
      try {
        await axios.delete(
          `${API_BASE_URL}/meal-conversation/${selectedMeal.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (err: any) {
        if (err.response && err.response.status === 404) {
          console.log("No conversation to delete.");
        } else {
          console.error("Error deleting conversation:", err);
        }
      }
      setConfirmModalOpen(false);
      setSelectedMeal(null);
      navigate("/menu");
    } catch (err) {
      console.error("Error cancelling meal:", err);
    }
  };

  const handleLeaveIt = () => {
    setConfirmModalOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const goToProfile = () => navigate("/Profile");
  const goToSettings = () => navigate("/Settings");
  const goToTalkToUs = () => navigate("/TalkToUs");

  const goToMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/food/myMeal`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.meal && data.meal.id) {
          // Pass mealId + role = "giver"
          navigate("/messages", {
            state: { mealId: data.meal.id.toString(), role: "giver" },
          });
        } else {
          alert("You have not posted a meal yet.");
        }
      } else {
        alert("Error fetching your meal.");
      }
    } catch (err) {
      console.error("Error fetching giver's meal:", err);
    }
  };

  if (loading) {
    return <div className="screen-container">Loading meals...</div>;
  }

  return (
    <div className="screen-container" style={{ position: "relative" }}>
      {/* Fixed Drop-Down Menu Icon */}
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
              onClick={() => {
                toggleMenu();
                goToTalkToUs();
              }}
            />
            <p>דבר איתנו</p>
          </div>
        </div>
      )}

      {selectedMeal && selectedMeal.user_id === localUserId && (
        <div className="mealCardGiver">
          <div style={{ display: "flex", flexDirection: "row" }}>
            {selectedMeal.avatar_url ? (
              (() => {
                // Use the URL constructor to create an absolute URL.
                const fullImageUrl = new URL(
                  selectedMeal.avatar_url,
                  API_BASE_URL
                ).href;
                return (
                  <img
                    src={fullImageUrl}
                    alt="Meal"
                    style={{
                      width: "100%",
                      maxWidth: "150px",
                      borderRadius: "8px",
                    }}
                  />
                );
              })()
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
            )}{" "}
            <div className="popupmeal" style={{ flex: "2" }}>
              <h3>{selectedMeal.item_description}</h3>
              <span>
                {selectedMeal.pickup_address}
                <img src={locationIcon} alt="location icon" />
              </span>

              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setConfirmModalOpen(true);
                }}
                style={{
                  color: "red",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                אני רוצה להסיר את המנה
              </a>
            </div>
          </div>
        </div>
      )}

      {confirmModalOpen && (
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
          <div
            className="modal-content"
            style={{
              textAlign: "center",
              backgroundColor: "rgb(252,251,242)",
              padding: "1rem",
              borderRadius: "25px",
              width: "80%",
              maxWidth: "400px",
            }}
          >
            <h3 style={{ fontSize: "1.5rem" }}>? בטוח שבא לך להסיר את המנה</h3>
            <p>
              אם המנה תוסר, היא לא תופיע יותר במפה. תוכל/י להעלות אותה שוב
              בהמשך.
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                marginTop: "1rem",
              }}
            >
              <button id="takeOffBtn" onClick={handleLeaveIt}>
                התחרטתי, תשאירו
              </button>
              <button onClick={handleConfirmCancel}>הסירו את המנה</button>
            </div>
          </div>
        </div>
      )}

      <div className="map-container" style={{ height: "100vh" }}>
        <Map
          initialViewState={{
            latitude: 32.0853,
            longitude: 34.7818,
            zoom: 12,
          }}
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
              <img
                src={manisrLogo}
                alt="Meal Marker"
                style={{ width: "30px", height: "30px", cursor: "pointer" }}
                onClick={() => setSelectedMeal(meal)}
              />
            </Marker>
          ))}
        </Map>
      </div>
    </div>
  );
};

export default GiverMealScreen;
