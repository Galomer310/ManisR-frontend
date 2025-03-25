// src/components/RealTimeMap.tsx
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { io, Socket } from "socket.io-client";
import L from "leaflet";

interface Location {
  lat: number;
  lng: number;
}

interface UserLocation extends Location {
  id: string;
}

interface RealTimeMapProps {
  userLocation: Location;
}

const socket: Socket = io(
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
);

const RealTimeMap: React.FC<RealTimeMapProps> = ({ userLocation }) => {
  const [onlineUsers, setOnlineUsers] = useState<UserLocation[]>([]);

  useEffect(() => {
    socket.emit("userLocation", userLocation);

    socket.on("newUserLocation", (data: UserLocation) => {
      setOnlineUsers((prev) => {
        if (!prev.find((user) => user.id === data.id)) {
          return [...prev, data];
        }
        return prev;
      });
    });

    socket.on("userDisconnected", ({ id }: { id: string }) => {
      setOnlineUsers((prev) => prev.filter((user) => user.id !== id));
    });

    return () => {
      socket.off("newUserLocation");
      socket.off("userDisconnected");
    };
  }, [userLocation]);

  return (
    <MapContainer
      center={[userLocation.lat, userLocation.lng]}
      zoom={14}
      className="map-container full-screen"
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[userLocation.lat, userLocation.lng]}>
        <Popup>Your Location</Popup>
      </Marker>
      {onlineUsers.map((user) => (
        <Marker
          key={user.id}
          position={[user.lat, user.lng]}
          icon={new L.Icon.Default()}
        >
          <Popup>User {user.id}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default RealTimeMap;
