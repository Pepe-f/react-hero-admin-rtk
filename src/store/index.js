import { configureStore } from '@reduxjs/toolkit'
import heroesReducer from './slices/heroesSlice'
import filtersReducer from './slices/filtersSlice'

const store = configureStore({
  reducer: { heroesReducer, filtersReducer },
  middleware: getDefaultMiddleware => getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== 'production'
})

export default store
