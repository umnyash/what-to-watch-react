import { createSlice } from '@reduxjs/toolkit';
import { SliceName } from '../../const';
import { PromoFilmState } from '../../types/state';
import { fetchPromoFilm, changeFavoriteStatus } from '../async-actions';

const initialState: PromoFilmState = {
  film: null,
};

export const promoFilm = createSlice({
  name: SliceName.PromoFilm,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchPromoFilm.fulfilled, (state, action) => {
        state.film = action.payload;
      })
      .addCase(changeFavoriteStatus.fulfilled, (state, action) => {
        if (state.film?.id === action.payload.id) {
          state.film.isFavorite = action.payload.isFavorite;
        }
      });
  },
});
