import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const signupApi = createApi({
  reducerPath: "signupApi",
  baseQuery,
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (credentials) => ({
        url: "signup",
        method: "POST",
        body: credentials,
      }),
    })
  })
});

export const { useSignupMutation } = signupApi;
