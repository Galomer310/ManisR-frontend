import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/manisr_logo.svg";
import giver from "../assets/Giver.svg";
import taker from "../assets/Taker.svg";
import { IoMenu, IoClose } from "react-icons/io5";
import ProfileIcon from "../assets/icons_white_profile.svg";
import settingsIcon from "../assets/icosnd_ settings.svg";
import talkToUsIcon from "../assets/icons_ messages.svg";
import alertsIcon from "../assets/1 notification alert icon.svg";

const Menu: React.FC = () => {
  const navigate = useNavigate();
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const goToProfile = () => navigate("/Profile");
  const goToSettings = () => navigate("/Settings");
  const goToTalkToUs = () => navigate("/TalkToUs");
  const goToMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/food/myMeal`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.meal && data.meal.id) {
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
      console.error("Error fetching meal:", err);
    }
  };

  // Updated handleTakeMeal: Check if user preferences exist before navigating.
  const handleTakeMeal = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User ID not found.");
      return;
    }
    try {
      const resPreferences = await fetch(
        `${API_BASE_URL}/preferences/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      let prefData = null;
      if (resPreferences.ok) {
        const json = await resPreferences.json();
        prefData = json.preferences;
      }
      if (!prefData) {
        alert("לא שמרת העדפות! אנא עדכן את פרטי החשבון שלך.");
        navigate("/accountDetails");
        return;
      }
      // If preferences exist, navigate to CollectFood (for takers).
      navigate("/collect-food");
    } catch (error) {
      console.error("Error checking preferences:", error);
      // In case of error, navigate to AccountDetails for safety.
      alert("Error checking preferences. Please update your account details.");
      navigate("/accountDetails");
    }
  };

  const handleGiveMeal = () => {
    navigate("/food/upload");
  };

  return (
    <div className="screen-container menu-container centered">
      {/* Top-right burger icon */}
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

      <img src={logo} alt="Manisr Logo" />

      <div style={{ margin: "5rem" }}>
        <button
          className="pickActionBtn"
          onClick={handleGiveMeal}
          style={{ marginRight: "1rem" }}
        >
          <img src={giver} alt="Give a Meal" />
        </button>
        <button className="pickActionBtn" onClick={handleTakeMeal}>
          <img src={taker} alt="Take a Meal" />
        </button>
      </div>
    </div>
  );
};

export default Menu;
