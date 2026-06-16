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
    renameChannel: builder.mutation({
      query: ({ id, name }) => ({
        url: `channels/${id}`,
        method: "PATCH",
        body: { name },
      }),
    }),
    removeChannel: builder.mutation({
      query: (id) => ({
        url: `channels/${id}`,
        method: "DELETE",
      })
    })
  }),
});

export const {
  useGetChannelsQuery,
  useCreateChannelMutation,
  useRenameChannelMutation,
  useRemoveChannelMutation,
} = channelsApi;
