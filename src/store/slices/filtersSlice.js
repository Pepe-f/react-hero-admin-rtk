import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice
} from '@reduxjs/toolkit'
import { useHttp } from '../../hooks/useHttp'

const filtersAdapter = createEntityAdapter()

const initialState = filtersAdapter.getInitialState({
  filtersLoadingStatus: 'idle',
  activeFilter: 'all'
})

export const filtersFetch = createAsyncThunk('filters/filtersFetch', () => {
  const { request } = useHttp()
  return request('http://localhost:3001/filters')
})

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    activeFilterChanged: (state, action) => {
      state.activeFilter = action.payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(filtersFetch.pending, state => {
        state.filtersLoadingStatus = 'loading'
      })
      .addCase(filtersFetch.fulfilled, (state, action) => {
        state.filtersLoadingStatus = 'idle'
        filtersAdapter.setAll(state, action.payload)
      })
      .addCase(filtersFetch.rejected, state => {
        state.filtersLoadingStatus = 'error'
      })
      .addDefaultCase(() => {})
  }
})

export default filtersSlice.reducer
export const { selectAll } = filtersAdapter.getSelectors(
  state => state.filtersReducer
)
export const { activeFilterChanged } = filtersSlice.actions
