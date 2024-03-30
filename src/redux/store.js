import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './api/apiSlice'
import accountSlice from './features/accountSlice'
import navbarSlice from './features/navbarSlice'
import taskSlice from './features/taskSlice'
import assigneeSlice from './features/assigneeSlice'
import projectSlice from './features/projectSlice'

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    account: accountSlice,
    navbar: navbarSlice,
    task: taskSlice,
    assignee: assigneeSlice,
    project: projectSlice
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(apiSlice.middleware)
  }
})

export default store
