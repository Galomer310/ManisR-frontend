// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import preferencesReducer from "./slices/preferencesSlice";
import archivedMealReducer from "./slices/archivedMealSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    preferences: preferencesReducer,
    archivedMeal: archivedMealReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
