// src/components/MapMarker.tsx
import L from "leaflet";

/**
 * Creates a custom Leaflet icon using an avatar image.
 * @param avatarUrl - The URL of the avatar image.
 */
export const createAvatarIcon = (avatarUrl: string) => {
  return L.icon({
    iconUrl: avatarUrl,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};
