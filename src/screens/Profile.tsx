// src/screens/Profile.tsx
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  IoIosArrowBack,
  IoIosArrowForward,
  IoIosCreate,
  IoIosPerson,
  IoIosLeaf,
  IoIosTime,
  IoMdPower,
} from "react-icons/io";
import orangeIcon from "../assets/orange tracker.svg";
import axios from "axios";

// Define the User interface
interface User {
  name: string;
  username: string;
  avatar_url?: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>(orangeIcon);
  const [user, setUser] = useState<User | null>(null);

  // Load user data from localStorage first, then refresh from the backend.
  useEffect(() => {
    // Load from localStorage if available.
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const userObject: User = JSON.parse(userString);
        setUser(userObject);
        if (userObject.avatar_url) {
          setAvatarUrl(userObject.avatar_url);
        }
      } catch (error) {
        console.error("Error parsing user data", error);
      }
    }

    // Fetch latest user data from backend.
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/users/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data.user) {
          setUser(response.data.user);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          if (response.data.user.avatar_url) {
            setAvatarUrl(response.data.user.avatar_url);
          }
        }
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUserData();
  }, []);

  // Trigger file input click when user clicks pencil icon
  const handleEditProfileImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // When a file is selected, show preview and update on backend
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Preview the image immediately
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target) {
          setAvatarUrl(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);

      // Prepare file for upload
      const formData = new FormData();
      formData.append("avatar", file);

      try {
        const token = localStorage.getItem("token");
        const response = await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/users/avatar`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // If your backend returns the new avatar URL, update state accordingly.
        if (response.data.avatarUrl) {
          setAvatarUrl(response.data.avatarUrl);
          // Update the user object and localStorage.
          const updatedUser = {
            ...user,
            avatar_url: response.data.avatarUrl,
          } as User;
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      } catch (error) {
        console.error("Error uploading avatar:", error);
      }
    }
  };

  const handleAccountDetails = () => {
    navigate("/accountDetails");
  };

  const handleFruits = () => {
    navigate("/myFruits");
  };

  const handleUsageHistory = () => {
    navigate("/usageHistory");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="profile-container" style={{ padding: "1rem" }}>
      {/* Hidden file input for selecting a new avatar */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

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
        <IoIosArrowForward size={24} color="black" />
      </div>

      {/* Top Section: Avatar + Edit Icon */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "1rem",
          position: "relative",
        }}
      >
        <div style={{ display: "inline-block", position: "relative" }}>
          <img
            src={avatarUrl}
            alt="User Avatar"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
          {/* Pencil icon overlay for editing */}
          <div
            onClick={handleEditProfileImage}
            style={{
              position: "absolute",
              bottom: "0",
              right: "0",
              backgroundColor: "#fff",
              borderRadius: "50%",
              padding: "0.3rem",
              cursor: "pointer",
              boxShadow: "0 0 5px rgba(0,0,0,0.2)",
            }}
          >
            <IoIosCreate size={18} color="black" />
          </div>
        </div>

        {/* Display real User Name & Username */}
        <h2 style={{ marginTop: "0.5rem", marginBottom: "0.2rem" }}>
          {user ? user.name : "User Name"}
        </h2>
        <span style={{ color: "#888" }}>
          {user ? `@${user.username}` : "@username"}
        </span>
      </div>

      {/* Navigation List */}
      <div className="profile-items">
        <div
          className="profile-item"
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            borderBottom: "1px solid gray",
          }}
          onClick={handleAccountDetails}
        >
          <IoIosArrowBack size={20} />
          <span>פרטי חשבון</span>
          <IoIosPerson size={20} style={{ marginLeft: "0.5rem" }} />
        </div>

        <div
          className="profile-item"
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            borderBottom: "1px solid gray",
          }}
          onClick={handleFruits}
        >
          <IoIosArrowBack size={20} />
          <span>פירות שצברתי ושוברים</span>
          <IoIosLeaf size={20} style={{ marginLeft: "0.5rem" }} />
        </div>

        <div
          className="profile-item"
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            borderBottom: "1px solid gray",
          }}
          onClick={handleUsageHistory}
        >
          <IoIosArrowBack size={20} />
          <span>היסטוריית שימוש</span>
          <IoIosTime size={20} style={{ marginLeft: "0.5rem" }} />
        </div>

        <div
          className="profile-item"
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          onClick={handleLogout}
        >
          <span>התנתק/י</span>
          <IoMdPower size={20} style={{ marginLeft: "0.5rem" }} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
