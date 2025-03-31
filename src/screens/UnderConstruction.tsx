// src/screens/UnderConstruction.tsx
import React from "react";
import { IoIosArrowForward } from "react-icons/io";
import { Gi3dHammer } from "react-icons/gi";
import { useNavigate } from "react-router-dom";

const UnderConstruction: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="under-construction-container"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f9f9f9, #e0e0e0)",
      }}
    >
      <div
        className="under-construction-content"
        style={{
          textAlign: "center",
          padding: "2rem",
          borderRadius: "8px",
          background: "rgba(255, 255, 255, 0.9)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Gi3dHammer size={64} color="#ff6600" />
        <h1 style={{ fontSize: "2.5rem", margin: "1rem 0" }}>
          Under Construction
        </h1>
        <p style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#555" }}>
          This section is currently under construction.
        </p>
        <p style={{ marginBottom: "2rem", color: "#777" }}>
          Please check back later for updates!
        </p>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            backgroundColor: "#ff6600",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          Go Back
        </button>
      </div>

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
        <IoIosArrowForward size={24} color="#333" />
      </div>
    </div>
  );
};

export default UnderConstruction;
