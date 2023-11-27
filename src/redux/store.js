import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './api/apiSlice'
import accountSlice from './features/accountSlice'
import navbarSlice from './features/navbarSlice'

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    account: accountSlice,
    navbar: navbarSlice,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(apiSlice.middleware)
  }
})

export default store
