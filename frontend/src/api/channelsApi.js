import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const channelsApi = createApi({
  reducerPath: "channelsApi",
  baseQuery,
  endpoints: (builder) => ({
    getChannels: builder.query({
      query: () => "channels",
    }),
    createChannel: builder.mutation({
      query: (data) => ({
        url: "channels",
        method: "POST",
        body: data,
      }),
    }),
    renameChannel: builder.query({
      mutation: (data) => ({
        url: `channels/${data.id}`,
        method: "PATCH",
        body: data.name,
      }),
    }),
  }),
});

export const {
  useGetChannelsQuery,
  useCreateChannelMutation,
  useRenameChannelMutation,
} = channelsApi;
