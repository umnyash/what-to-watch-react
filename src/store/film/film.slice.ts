import { createSlice } from '@reduxjs/toolkit';
import { SliceName, RequestStatus, ERROR_PLACEHOLDER_MESSAGE } from '../../const';
import { FilmState } from '../../types/state';
import { fetchFilm, fetchFavorites, changeFavoriteStatus, logoutUser, submitReview } from '../async-actions';
import { PageFilm } from '../../types/films';

const initialState: FilmState = {
  id: null,
  loadingStatus: RequestStatus.Idle,
  film: null,
  error: null,
};

const updateFilmRating = (film: PageFilm, reviewRating: number) => {
  film.rating = (film.scoresCount * film.rating + reviewRating) / (film.scoresCount + 1);
  film.scoresCount++;
};

export const filmSlice = createSlice({
  name: SliceName.Film,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchFilm.pending, (state, action) => {
        state.id = action.meta.arg;
        state.loadingStatus = RequestStatus.Pending;
        state.film = null;
        state.error = null;
      })
      .addCase(fetchFilm.fulfilled, (state, action) => {
        if (state.id === action.meta.arg) {
          state.loadingStatus = RequestStatus.Success;
          state.film = action.payload;
        }
      })
      .addCase(fetchFilm.rejected, (state, action) => {
        if (state.id === action.meta.arg) {
          state.loadingStatus = RequestStatus.Error;
          state.error = action.payload ?? ERROR_PLACEHOLDER_MESSAGE;
        }
      })

      .addCase(fetchFavorites.fulfilled, (state, action) => {
        if (state.film) {
          const filmId = state.film.id;
          state.film.isFavorite = action.payload.some((film) => film.id === filmId);
        }
      })

      .addCase(changeFavoriteStatus.fulfilled, (state, action) => {
        if (state.film?.id === action.payload.id) {
          state.film.isFavorite = action.payload.isFavorite;
        }
      })

      .addCase(logoutUser.fulfilled, (state) => {
        if (state.film) {
          state.film.isFavorite = false;
        }
      })

      .addCase(submitReview.fulfilled, (state, action) => {
        if (state.film?.id === action.meta.arg.filmId) {
          updateFilmRating(state.film, action.payload.rating);
        }
      });
  },
});
