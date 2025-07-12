import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SliceName, RequestStatus, FILMS_PER_LOAD } from '../../const';
import { CatalogState } from '../../types/state';
import { fetchFilms } from '../async-actions';

const initialState: CatalogState = {
  films: [],
  filmsLoadingStatus: RequestStatus.Idle,
  filter: {
    genre: null,
  },
  displayedFilmsMaxCount: FILMS_PER_LOAD,
};

export const catalogSlice = createSlice({
  name: SliceName.Catalog,
  initialState,
  reducers: {
    setGenreFilter: (state, action: PayloadAction<CatalogState['filter']['genre']>) => {
      state.filter.genre = action.payload;
    },
    increaseDisplayedFilmsMaxCount: (state) => {
      state.displayedFilmsMaxCount += FILMS_PER_LOAD;
    },
    resetDisplayedFilmsMaxCount: (state) => {
      state.displayedFilmsMaxCount = FILMS_PER_LOAD;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchFilms.pending, (state) => {
        state.filmsLoadingStatus = RequestStatus.Pending;
      })
      .addCase(fetchFilms.fulfilled, (state, action) => {
        state.films = action.payload;
        state.filmsLoadingStatus = RequestStatus.Success;
      })
      .addCase(fetchFilms.rejected, (state) => {
        state.filmsLoadingStatus = RequestStatus.Error;
      });
  },
});

export const catalogActions = catalogSlice.actions;
