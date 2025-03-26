import React, { useEffect, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const DEFAULT_LOCATION = { lat: 32.0853, lng: 34.7818 };

const DeviceLocationMap: React.FC = () => {
  const [viewport, setViewport] = useState({
    latitude: DEFAULT_LOCATION.lat,
    longitude: DEFAULT_LOCATION.lng,
    zoom: 14,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setViewport((prev) => ({
            ...prev,
            latitude: coords.latitude,
            longitude: coords.longitude,
          }));
        },
        () => setError("Geolocation failed.")
      );
    } else {
      setError("Geolocation is not supported.");
    }
  }, []);

  return (
    <div className="map-container">
      {error && <p className="error">{error}</p>}
      {/* Updated to react-map-gl */}
      <Map
        initialViewState={viewport}
        style={{ width: "100%", height: "100%" }}
        onMove={(evt) => setViewport(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
      >
        <Marker latitude={viewport.latitude} longitude={viewport.longitude}>
          <div style={{ fontSize: "24px" }}>📍</div>
        </Marker>
        <Popup
          latitude={viewport.latitude}
          longitude={viewport.longitude}
          closeOnClick={false}
        >
          You are here
        </Popup>
      </Map>
    </div>
  );
};

export default DeviceLocationMap;
