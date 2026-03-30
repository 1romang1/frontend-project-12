import { createSlice } from "@reduxjs/toolkit";

const channelsSlice = createSlice({
  name: "channels",
  initialState: {
    items: [],
  },
  reducers: {
    setChannels: (state, action) => {
      state.items = action.payload.channels;
    },
  },
});

export const { setChannels } = channelsSlice.actions;
export const channelsReducer = channelsSlice.reducer;
