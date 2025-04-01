import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PreferencesState {
  location: { city: string; radius: number } | null;
  food: { foodPreference: string; allergies: string[] } | null;
}

const initialState: PreferencesState = { location: null, food: null };

const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    setLocation(state, action: PayloadAction<{ city: string; radius: number }>) {
      state.location = action.payload;
    },
    setFoodPreferences(
      state,
      action: PayloadAction<{ foodPreference: string; allergies: string[] }>
    ) {
      state.food = action.payload;
    },
    clearPreferences(state) {
      state.location = null;
      state.food = null;
    },
  },
});

export const { setLocation, setFoodPreferences, clearPreferences } = preferencesSlice.actions;
export default preferencesSlice.reducer;
