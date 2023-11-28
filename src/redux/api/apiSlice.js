import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { LOCAL_API_URL } from '../../constants'

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: LOCAL_API_URL,
        prepareHeaders: (headers) => {
          const token = localStorage.getItem('token');
          if (token) {
            headers.set('authorization', `Bearer ${token}`);
          }
          return headers;
        },
      }),
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
            }),
            listUsers: builder.query({
                query: () => `/users/`
            }),
            listUserProjects: builder.query({
                query: () => `/projects`
            }),
            listUserTasks: builder.query({
                query: () => `/tasks`
            }),
            getTaskDetails: builder.query({
                query: ({ id }) => `/tasks/${id}`
            }),
        }
    }
})

export const { useLoginMutation, useRegisterMutation, useLazyListUsersQuery, useLazyListUserProjectsQuery, useLazyListUserTasksQuery, useLazyGetTaskDetailsQuery } = apiSlice
