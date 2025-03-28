import { createSlice } from '@reduxjs/toolkit';
import { SliceName, RequestStatus, ERROR_PLACEHOLDER_MESSAGE } from '../../const';
import { FilmState } from '../../types/state';
import { fetchFilm, changeFavoriteStatus } from '../async-actions';

const initialState: FilmState = {
  film: null,
  loadingStatus: RequestStatus.Idle,
  error: null,
};

export const film = createSlice({
  name: SliceName.Film,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchFilm.pending, (state) => {
        state.loadingStatus = RequestStatus.Pending;
        state.error = null;
      })
      .addCase(fetchFilm.fulfilled, (state, action) => {
        state.film = action.payload;
        state.loadingStatus = RequestStatus.Success;
      })
      .addCase(fetchFilm.rejected, (state, action) => {
        state.film = null;
        state.loadingStatus = RequestStatus.Error;
        state.error = action.payload ?? ERROR_PLACEHOLDER_MESSAGE;
      })

      .addCase(changeFavoriteStatus.fulfilled, (state, action) => {
        if (state.film?.id === action.payload.id) {
          state.film.isFavorite = action.payload.isFavorite;
        }
      });
  },
});
