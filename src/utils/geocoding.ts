// src/utils/geocoding.ts

/**
 * Reverse geocodes latitude and longitude into a human‑readable address.
 * Uses the Nominatim reverse geocoding API.
 * Returns the full display_name (or an empty string on error).
 */
export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      return data.display_name || "";
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      return "";
    }
  };
  