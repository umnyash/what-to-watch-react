import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SliceName, RequestStatus, ALL_GENRES, FILMS_PER_LOAD } from '../../const';
import { CatalogState } from '../../types/state';
import { fetchFilms } from '../async-actions';

const initialState: CatalogState = {
  films: [],
  filmsLoadingStatus: RequestStatus.Idle,
  genre: ALL_GENRES,
  displayedFilmsMaxCount: FILMS_PER_LOAD,
};

export const catalog = createSlice({
  name: SliceName.Catalog,
  initialState,
  reducers: {
    setGenre: (state, action: PayloadAction<string>) => {
      state.genre = action.payload;
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

export const catalogActions = catalog.actions;
