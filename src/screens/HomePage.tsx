// src/screens/HomePage.tsx
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";
import { createAvatarIcon } from "../components/MapMarker";
import { useNavigate } from "react-router-dom";

/**
 * Interface for food items returned from the backend.
 */
interface FoodItem {
  id: number;
  item_description: string;
  pickup_address: string;
  lat: number | null;
  lng: number | null;
  avatar_url: string;
}

const HomePage: React.FC = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/food/available`
        );
        setFoodItems(response.data.meals);
      } catch (err) {
        console.error("Error fetching food items:", err);
      }
    };
    fetchFoodItems();
  }, []);

  const handleMessageClick = (giverId: number) => {
    navigate("/chat", { state: { giverId } });
  };

  return (
    <div className="screen-container" style={{ height: "100vh" }}>
      <MapContainer
        center={[32.0853, 34.7818]}
        zoom={13}
        className="map-container"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {foodItems.map((item) => {
          if (item.lat && item.lng) {
            return (
              <Marker
                key={item.id}
                position={[item.lat, item.lng]}
                icon={createAvatarIcon(item.avatar_url)}
              >
                <Popup>
                  <div>
                    <p>{item.item_description}</p>
                    <p>{item.pickup_address}</p>
                    <button onClick={() => handleMessageClick(item.id)}>
                      Message Giver
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          }
          return null;
        })}
      </MapContainer>
    </div>
  );
};

export default HomePage;
