import { createSlice } from "@reduxjs/toolkit";

const channelsSlice = createSlice({
  name: "channels",
  initialState: {
    currentChannelId: null,
  },
  reducers: {
    setCurrentChannelId: (state, action) => {
      state.currentChannelId = action.payload.id;
    },
  },
});

export const { setChannels } = channelsSlice.actions;
export const channelsReducer = channelsSlice.reducer;
