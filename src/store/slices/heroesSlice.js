import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice
} from '@reduxjs/toolkit'
import { useHttp } from '../../hooks/useHttp'

const heroesAdapter = createEntityAdapter()

const initialState = heroesAdapter.getInitialState({
  heroesLoadingStatus: 'idle'
})

export const heroesFetch = createAsyncThunk('heroes/heroesFetch', () => {
  const { request } = useHttp()
  return request('http://localhost:3001/heroes')
})

const heroesSlice = createSlice({
  name: 'heroes',
  initialState,
  reducers: {
    heroCreated: (state, action) => {
      heroesAdapter.addOne(state, action.payload)
    },
    heroDeleted: (state, action) => {
      heroesAdapter.removeOne(state, action.payload)
    }
  },
  extraReducers: builder => {
    builder
      .addCase(heroesFetch.pending, state => {
        state.heroesLoadingStatus = 'loading'
      })
      .addCase(heroesFetch.fulfilled, (state, action) => {
        state.heroesLoadingStatus = 'idle'
        heroesAdapter.setAll(state, action.payload)
      })
      .addCase(heroesFetch.rejected, state => {
        state.heroesLoadingStatus = 'error'
      })
      .addDefaultCase(() => {})
  }
})

export default heroesSlice.reducer
export const { selectAll } = heroesAdapter.getSelectors(
  state => state.heroesReducer
)
export const filteredHeroesSelector = createSelector(
  state => state.filtersReducer.activeFilter,
  selectAll,
  (filter, heroes) => {
    if (filter === 'all') {
      return heroes
    } else {
      return heroes.filter(item => item.element === filter)
    }
  }
)
export const { heroCreated, heroDeleted } = heroesSlice.actions
