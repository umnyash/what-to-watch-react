import { combineReducers } from '@reduxjs/toolkit';
import { user } from './user/user.slice';
import { catalog } from './catalog/catalog.slice';
import { film } from './film/film.slice';
import { promoFilm } from './promo-film/promo-film.slice';
import { similarFilms } from './similar-films/similar-films.slice';
import { favorites } from './favorites/favorites.slice';
import { reviews } from './reviews/reviews.slice';

export const rootReducer = combineReducers({
  [user.name]: user.reducer,
  [catalog.name]: catalog.reducer,
  [film.name]: film.reducer,
  [promoFilm.name]: promoFilm.reducer,
  [similarFilms.name]: similarFilms.reducer,
  [favorites.name]: favorites.reducer,
  [reviews.name]: reviews.reducer,
});
