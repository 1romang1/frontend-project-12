import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../api/authApi";
import { authReducer } from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddlware) =>
    getDefaultMiddlware().concat(authApi.middleware),
});
