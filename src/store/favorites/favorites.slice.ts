import { createSlice } from '@reduxjs/toolkit';
import { SliceName } from '../../const';
import { FavoritesState } from '../../types/state';
import { FullFilm } from '../../types/films';
import { fetchFavorites, changeFavoriteStatus } from '../async-actions';
import { removeArrayItem } from '../../util';

const initialState: FavoritesState = {
  films: [],
  changingStatusFilmsIds: [],
};

const updateFavorites = (state: FavoritesState, film: FullFilm) => {
  if (film.isFavorite) {
    state.films.push(film);
  } else {
    removeArrayItem(state.films, { id: film.id });
  }
};

export const favorites = createSlice({
  name: SliceName.Favorites,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.films = action.payload;
      })
      .addCase(changeFavoriteStatus.pending, (state, action) => {
        state.changingStatusFilmsIds.push(action.meta.arg.filmId);
      })
      .addCase(changeFavoriteStatus.fulfilled, (state, action) => {
        updateFavorites(state, action.payload);
        removeArrayItem(state.changingStatusFilmsIds, action.meta.arg.filmId);
      })
      .addCase(changeFavoriteStatus.rejected, (state, action) => {
        removeArrayItem(state.changingStatusFilmsIds, action.meta.arg.filmId);
      });
  },
});
