// src/store/slices/archivedMealSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ArchivedMealState {
  archivedMealId: number | null;
}

const initialState: ArchivedMealState = {
  archivedMealId: null,
};

const archivedMealSlice = createSlice({
  name: "archivedMeal",
  initialState,
  reducers: {
    setArchivedMealId(state, action: PayloadAction<number>) {
      state.archivedMealId = action.payload;
    },
    clearArchivedMeal(state) {
      state.archivedMealId = null;
    },
  },
});

export const { setArchivedMealId, clearArchivedMeal } = archivedMealSlice.actions;
export default archivedMealSlice.reducer;
