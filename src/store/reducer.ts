import { createReducer } from '@reduxjs/toolkit';
import { User } from '../types/user';
import { Films, FilmState, PromoFilm } from '../types/films';
import { Reviews } from '../types/reviews';
import { AuthorizationStatus, ALL_GENRES } from '../const';

import {
  setAuthorizationStatus,
  setUser,
  setFilms,
  setFilmsLoadingStatus,
  setFilm,
  setFilmLoadingStatus,
  setPromoFilm,
  setSimilarFilms,
  setReviews,
  setGenre
} from './actions';

type InitialState = {
  authorizationStatus: AuthorizationStatus;
  user: User | null;
  films: Films;
  isFilmsLoading: boolean;
  film: FilmState;
  isFilmLoading: boolean;
  promoFilm: PromoFilm | null;
  similarFilms: Films;
  reviews: Reviews;
  genre: string;
}

const initialState: InitialState = {
  authorizationStatus: AuthorizationStatus.Unknown,
  user: null,
  films: [],
  isFilmsLoading: false,
  film: null,
  isFilmLoading: false,
  promoFilm: null,
  similarFilms: [],
  reviews: [],
  genre: ALL_GENRES,
};

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setAuthorizationStatus, (state, action) => {
      state.authorizationStatus = action.payload;
    })
    .addCase(setUser, (state, action) => {
      state.user = action.payload;
    })
    .addCase(setFilms, (state, action) => {
      state.films = action.payload;
    })
    .addCase(setFilmsLoadingStatus, (state, action) => {
      state.isFilmsLoading = action.payload;
    })
    .addCase(setFilm, (state, action) => {
      state.film = action.payload;
    })
    .addCase(setFilmLoadingStatus, (state, action) => {
      state.isFilmLoading = action.payload;
    })
    .addCase(setPromoFilm, (state, action) => {
      state.promoFilm = action.payload;
    })
    .addCase(setSimilarFilms, (state, action) => {
      state.similarFilms = action.payload;
    })
    .addCase(setReviews, (state, action) => {
      state.reviews = action.payload;
    })
    .addCase(setGenre, (state, action) => {
      state.genre = action.payload;
    });
});

export { reducer };
