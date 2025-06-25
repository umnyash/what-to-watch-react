import { createSlice } from '@reduxjs/toolkit';
import { SliceName, RequestStatus } from '../../const';
import { PromoFilmState } from '../../types/state';
import { fetchPromoFilm, fetchFavorites, changeFavoriteStatus, logoutUser } from '../async-actions';

const initialState: PromoFilmState = {
  film: null,
  loadingStatus: RequestStatus.Idle,
};

export const promoFilmSlice = createSlice({
  name: SliceName.PromoFilm,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchPromoFilm.pending, (state) => {
        state.loadingStatus = RequestStatus.Pending;
      })
      .addCase(fetchPromoFilm.fulfilled, (state, action) => {
        state.film = action.payload;
        state.loadingStatus = RequestStatus.Success;
      })
      .addCase(fetchPromoFilm.rejected, (state) => {
        state.loadingStatus = RequestStatus.Error;
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
      });
  },
});
