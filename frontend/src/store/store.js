import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../api/authApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddlware) =>
    getDefaultMiddlware().concat(authApi.middleware),
});
