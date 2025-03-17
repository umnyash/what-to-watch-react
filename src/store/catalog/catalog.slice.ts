import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SliceName, RequestStatus, ALL_GENRES } from '../../const';
import { CatalogState } from '../../types/state';
import { fetchFilms } from '../async-actions';

const initialState: CatalogState = {
  films: [],
  filmsLoadingStatus: RequestStatus.Idle,
  genre: ALL_GENRES,
};

export const catalog = createSlice({
  name: SliceName.Catalog,
  initialState,
  reducers: {
    setGenre: (state, action: PayloadAction<string>) => {
      state.genre = action.payload;
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
