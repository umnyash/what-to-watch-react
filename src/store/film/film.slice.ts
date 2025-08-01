import { createSlice } from '@reduxjs/toolkit';
import { SliceName, RequestStatus, ERROR_PLACEHOLDER_MESSAGE } from '../../const';
import { FilmState } from '../../types/state';
import { fetchFilm, fetchFavorites, changeFavoriteStatus, logoutUser, submitReview } from '../async-actions';
import { PageFilm } from '../../types/films';

const initialState: FilmState = {
  film: null,
  loadingStatus: RequestStatus.Idle,
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
      .addCase(fetchFilm.pending, (state) => {
        state.film = null;
        state.loadingStatus = RequestStatus.Pending;
        state.error = null;
      })
      .addCase(fetchFilm.fulfilled, (state, action) => {
        state.film = action.payload;
        state.loadingStatus = RequestStatus.Success;
      })
      .addCase(fetchFilm.rejected, (state, action) => {
        state.loadingStatus = RequestStatus.Error;
        state.error = action.payload ?? ERROR_PLACEHOLDER_MESSAGE;
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
