import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { LOCAL_API_URL } from '../../constants'

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: LOCAL_API_URL }),
    endpoints: (builder) => {
        return {
            login: builder.mutation({
                query: ({ email, password }) => ({
                    url: '/users/auth/login',
                    method: 'POST',
                    body: { email, password },
                }),
            }),
            register: builder.mutation({
                query: ({ email, password, name, address, phone }) => ({
                    url: '/users/auth/register',
                    method: 'POST',
                    body: {
                        email,
                        password,
                        name,
                        address,
                        phone,
                    }
                }),
            })
        }
    }
})

export const { useLoginMutation, useRegisterMutation } = apiSlice
