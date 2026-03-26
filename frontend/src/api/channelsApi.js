import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const channelsApi = createApi({
    reducerPath: 'channelsApi',
    baseQuery,
    endpoints: (builder) => ({
        getChannels: builder.query({
            query: () => 'channels'
        })
    })
})

export const { useGetChannelsQuery } = channelsApi;
