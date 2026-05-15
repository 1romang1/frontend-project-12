import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token"),
    username: localStorage.getItem("username"),
  },
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.username = action.payload.username
      localStorage.setItem("token", state.token);
      localStorage.setItem("username", state.username);
    },
    logout: (state) => {
      state.token = null;
      localStorage.removeItem("token");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
