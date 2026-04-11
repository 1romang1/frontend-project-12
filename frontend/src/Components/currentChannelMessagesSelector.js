import { createSelector } from "@reduxjs/toolkit";

export const selectAllMessages = (state) => state.messages.items;
export const selectCurrentChannelId = (state) => state.channels.currentChannelId;

export const selectCurrentChannelMessages = createSelector(
    [selectAllMessages, selectCurrentChannelId],
    (messages, currentChannelId) => messages.filter((message) => message.channelId === currentChannelId)
);