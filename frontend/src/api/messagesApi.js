import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const messagesApi = createApi({
    reducerPath: 'messagesApi',
    baseQuery,
    endpoints: (builder) => ({
        getMessages: builder.query({
            query: () => 'messages'
        }),
        sendMessage: builder.mutation({
            query: (message) => ({
                url: 'messages',
                method: 'POST',
                body: message,
            })
        })
    })
})

export const { useGetMessagesQuery, useSendMessageMutation } = messagesApi;
