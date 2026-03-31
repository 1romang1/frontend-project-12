import { createSlice } from "@reduxjs/toolkit";

const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    items: [],
  },
  reducers: {
    setMessages: (state, action) => {
      state.items = action.payload.messages;
    },
  },
});

export const { setMessages } = messagesSlice.actions;
export const messagesReducer = messagesSlice.reducer;
