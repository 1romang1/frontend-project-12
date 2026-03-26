import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const messagesApi = createApi({
    reducerPath: 'messagesApi',
    baseQuery,
    endpoints: (builder) => ({
        getChannels: builder.query({
            query: () => 'messages'
        })
    })
})

export const { useGetMessagesQuery } = messagesApi;
