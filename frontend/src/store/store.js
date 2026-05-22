import { configureStore } from "@reduxjs/toolkit";
import { signupApi } from "../api/signupApi";
import { authApi } from "../api/authApi";
import { authReducer } from "./slices/authSlice";
import { channelsApi } from "../api/channelsApi";
import { channelsReducer } from "./slices/channelsSlice";
import { messagesApi } from "../api/messagesApi";
import { socketMiddleware } from "../services/socketMiddleware";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    channels: channelsReducer,

    [authApi.reducerPath]: authApi.reducer,
    [signupApi.reducerPath]: signupApi.reducer,
    [channelsApi.reducerPath]: channelsApi.reducer,
    [messagesApi.reducerPath]: messagesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      signupApi.middleware,
      channelsApi.middleware,
      messagesApi.middleware,
      socketMiddleware,
    ),
});
