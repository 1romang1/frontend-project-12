import { createSlice } from "@reduxjs/toolkit";

const channelsSlice = createSlice({
  name: "channels",
  initialState: {
    currentChannelId: null,
  },
  reducers: {
    setCurrentChannelId: (state, action) => {
       console.log("setCurrentChannelId:", action.payload);
      state.currentChannelId = action.payload;
    },
  },
});

export const { setCurrentChannelId } = channelsSlice.actions;
export const channelsReducer = channelsSlice.reducer;
