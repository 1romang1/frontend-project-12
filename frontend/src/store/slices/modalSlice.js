import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
    name: 'modal',
    initialState: {
        type: null,
        channelId: null,
    },
    reducers: {
        openModal: (state, action) => {
            state.type = action.payload.type;
            state.channelId = action.payload.channelId;
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            (action) => action.type.endsWith('/fulfilled'),
            (state) => {
               state.type = null;
               state.channelId = null;
            }
        )
    }
})

export const {openModal} = modalSlice.actions;
export default modalSlice.reducer;