// src/components/GiverOSMMap.tsx
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

interface GiverOSMMapProps {
  lat: number;
  lng: number;
}

/**
 * GiverOSMMap displays a map centered at the given latitude/longitude.
 */
const GiverOSMMap: React.FC<GiverOSMMapProps> = ({ lat, lng }) => {
  const position: [number, number] = [lat, lng];
  return (
    <MapContainer center={position} zoom={14} className="map-container">
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>Pickup location</Popup>
      </Marker>
    </MapContainer>
  );
};

export default GiverOSMMap;
