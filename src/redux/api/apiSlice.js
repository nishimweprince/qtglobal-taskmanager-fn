import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL, LOCAL_API_URL } from '../../constants'

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: "https://qtglobal-taskmanager-bn.onrender.com/api" || API_URL || LOCAL_API_URL,
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
                query: () => `/projects/all`
            }),
            listUserTasks: builder.query({
                query: ({ assignee_id }) => `/tasks/all?assignee_id=${assignee_id}`
            }),
            getTaskDetails: builder.query({
                query: ({ id }) => `/tasks/${id}`
            }),
            createProject: builder.mutation({
                query: ({ title, description }) => ({
                    url: '/projects',
                    method: 'POST',
                    body: { title, description }
                })
            }),
            updateTask: builder.mutation({
                query: ({ id, status, title, priority, description }) => ({
                    url: `/tasks/${id}`,
                    method: 'PATCH',
                    body: { status, title, priority, description }
                })
            }),
            deleteTask: builder.mutation({
                query: ({ id }) => ({
                    url: `/tasks/${id}`,
                    method: 'DELETE'
                })
            }),
            deleteUser: builder.mutation({
                query: ({ id }) => ({
                    url: `/users/${id}`,
                    method: 'DELETE'
                })
            })
        }
    }
})

export const { useLoginMutation, useRegisterMutation, useLazyListUsersQuery, useLazyListUserProjectsQuery, useLazyListUserTasksQuery, useLazyGetTaskDetailsQuery, useCreateProjectMutation, useUpdateTaskMutation, useDeleteTaskMutation, useDeleteUserMutation } = apiSlice
