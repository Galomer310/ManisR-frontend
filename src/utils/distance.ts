// src/utils/distance.ts

/**
 * Calculates the great‑circle distance (in km) between two coordinates using the Haversine formula.
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  
  /**
   * Estimates travel time in minutes given a distance (in km).
   * Default walking speed is assumed to be 5 km/h.
   */
  export function estimateTravelTime(distance: number, speedKmH: number = 5): number {
    const timeHours = distance / speedKmH;
    return timeHours * 60;
  }
  