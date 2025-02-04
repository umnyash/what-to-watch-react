import { createReducer } from '@reduxjs/toolkit';
import { User } from '../types/user';
import { Films, FilmState } from '../types/films';
import { AuthorizationStatus, ALL_GENRES } from '../const';

import {
  setAuthorizationStatus,
  setUser,
  setFilms,
  setFilmsLoadingStatus,
  setFilm,
  setFilmLoadingStatus,
  setGenre
} from './actions';

type InitialState = {
  authorizationStatus: AuthorizationStatus;
  user: User | null;
  films: Films;
  isFilmsLoading: boolean;
  film: FilmState;
  isFilmLoading: boolean;
  genre: string;
}

const initialState: InitialState = {
  authorizationStatus: AuthorizationStatus.Unknown,
  user: null,
  films: [],
  isFilmsLoading: false,
  film: null,
  isFilmLoading: false,
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
    .addCase(setGenre, (state, action) => {
      state.genre = action.payload;
    });
});

export { reducer };
