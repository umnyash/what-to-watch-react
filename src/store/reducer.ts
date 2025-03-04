import { createReducer } from '@reduxjs/toolkit';
import { User } from '../types/user';
import { Films, PageFilm, PromoFilm } from '../types/films';
import { Reviews } from '../types/reviews';
import { AuthorizationStatus, RequestStatus, ALL_GENRES } from '../const';
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
  isFilmsLoading: RequestStatus;
  film: PageFilm | null;
  isFilmLoading: RequestStatus;
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
  isFilmsLoading: RequestStatus.Idle,
  film: null,
  isFilmLoading: RequestStatus.Idle,
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
      state.isFilmsLoading = RequestStatus.Pending;
    })
    .addCase(fetchFilms.fulfilled, (state, action) => {
      state.films = action.payload;
      state.isFilmsLoading = RequestStatus.Success;
    })
    .addCase(fetchFilms.rejected, (state) => {
      state.isFilmsLoading = RequestStatus.Error;
    })

    .addCase(fetchFilm.pending, (state) => {
      state.isFilmLoading = RequestStatus.Pending;
    })
    .addCase(fetchFilm.fulfilled, (state, action) => {
      state.film = action.payload;
      state.isFilmLoading = RequestStatus.Success;
    })
    .addCase(fetchFilm.rejected, (state) => {
      state.film = null;
      state.isFilmLoading = RequestStatus.Error;
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
