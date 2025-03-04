import { createReducer } from '@reduxjs/toolkit';
import { User } from '../types/user';
import { Films, PageFilm, PromoFilm } from '../types/films';
import { Reviews } from '../types/reviews';
import { AuthorizationStatus, ALL_GENRES } from '../const';
import { setGenre } from './actions';

import {
  checkUserAuth,
  loginUser,
  logoutUser,
  fetchFilms,
  fetchFilm,
  fetchPromoFilm,
  fetchSimilarFilms,
  fetchFavorites,
  fetchReviews,
  submitReview,
} from './async-actions';

type InitialState = {
  authorizationStatus: AuthorizationStatus;
  user: User | null;
  films: Films;
  isFilmsLoading: boolean;
  film: PageFilm | null;
  isFilmLoading: boolean;
  promoFilm: PromoFilm | null;
  similarFilms: Films;
  favorites: Films;
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
  favorites: [],
  reviews: [],
  genre: ALL_GENRES,
};

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(checkUserAuth.fulfilled, (state, action) => {
      state.authorizationStatus = AuthorizationStatus.Auth;
      state.user = action.payload;
    })
    .addCase(checkUserAuth.rejected, (state) => {
      state.authorizationStatus = AuthorizationStatus.NoAuth;
    })

    .addCase(loginUser.fulfilled, (state, action) => {
      state.authorizationStatus = AuthorizationStatus.Auth;
      state.user = action.payload;
    })

    .addCase(logoutUser.fulfilled, (state) => {
      state.authorizationStatus = AuthorizationStatus.NoAuth;
      state.user = null;
    })

    .addCase(fetchFilms.pending, (state) => {
      state.isFilmsLoading = true;
    })
    .addCase(fetchFilms.fulfilled, (state, action) => {
      state.films = action.payload;
      state.isFilmsLoading = false;
    })
    .addCase(fetchFilms.rejected, (state) => {
      state.isFilmsLoading = false;
    })

    .addCase(fetchFilm.pending, (state) => {
      state.isFilmLoading = true;
    })
    .addCase(fetchFilm.fulfilled, (state, action) => {
      state.film = action.payload;
      state.isFilmLoading = false;
    })
    .addCase(fetchFilm.rejected, (state) => {
      state.film = null;
      state.isFilmLoading = false;
    })

    .addCase(fetchPromoFilm.fulfilled, (state, action) => {
      state.promoFilm = action.payload;
    })

    .addCase(fetchSimilarFilms.fulfilled, (state, action) => {
      state.similarFilms = action.payload;
    })

    .addCase(fetchFavorites.fulfilled, (state, action) => {
      state.favorites = action.payload;
    })

    .addCase(fetchReviews.fulfilled, (state, action) => {
      state.reviews = action.payload;
    })

    .addCase(submitReview.fulfilled, (state, action) => {
      state.reviews.push(action.payload);
    })

    .addCase(setGenre, (state, action) => {
      state.genre = action.payload;
    });
});

export { reducer };
