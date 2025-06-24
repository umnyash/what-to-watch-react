import { combineReducers } from '@reduxjs/toolkit';
import { userSlice } from './user/user.slice';
import { catalogSlice } from './catalog/catalog.slice';
import { filmSlice } from './film/film.slice';
import { promoFilmSlice } from './promo-film/promo-film.slice';
import { similarFilmsSlice } from './similar-films/similar-films.slice';
import { favoritesSlice } from './favorites/favorites.slice';
import { reviewsSlice } from './reviews/reviews.slice';
import { playerSlice } from './player/player.slice';

export const rootReducer = combineReducers({
  [userSlice.name]: userSlice.reducer,
  [catalogSlice.name]: catalogSlice.reducer,
  [filmSlice.name]: filmSlice.reducer,
  [promoFilmSlice.name]: promoFilmSlice.reducer,
  [similarFilmsSlice.name]: similarFilmsSlice.reducer,
  [favoritesSlice.name]: favoritesSlice.reducer,
  [reviewsSlice.name]: reviewsSlice.reducer,
  [playerSlice.name]: playerSlice.reducer,
});
