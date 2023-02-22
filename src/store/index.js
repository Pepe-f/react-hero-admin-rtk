import { configureStore } from '@reduxjs/toolkit'
import heroesReducer from './slices/heroesSlice'
import filtersReducer from './slices/filtersSlice'
import { apiSlice } from './slices/apiSlice'

const store = configureStore({
  reducer: {
    heroesReducer,
    filtersReducer,
    [apiSlice.reducerPath]: apiSlice.reducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== 'production'
})

export default store
