import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../api/authApi";
import { authReducer } from "./slices/authSlice";
import { channelsApi } from "../api/channelsApi";
import { channelsReducer } from "./slices/channelsSlice";
import { messagesApi } from "../api/messagesApi";
import { messagesReducer } from "./slices/messagesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    channels: channelsReducer,
    messages: messagesReducer,
    [authApi.reducerPath]: authApi.reducer,
    [channelsApi.reducerPath]: channelsApi.reducer,
    [messagesApi.reducerPath]: messagesReducer,
  },
  middleware: (getDefaultMiddlware) =>
    getDefaultMiddlware().concat(
      authApi.middleware,
      channelsApi.middleware,
      messagesApi.middleware,
    ),
});
