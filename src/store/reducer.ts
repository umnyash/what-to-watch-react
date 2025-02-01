import { createReducer } from '@reduxjs/toolkit';
import { setFilms, setFilmsLoadingStatus, setGenre } from './actions';
import { User } from '../types/user';
import { Films } from '../types/films';
import { AuthorizationStatus, ALL_GENRES } from '../const';

type InitialState = {
  authorizationStatus: AuthorizationStatus;
  user: User | null;
  films: Films;
  isFilmsLoading: boolean;
  genre: string;
}

const initialState: InitialState = {
  authorizationStatus: AuthorizationStatus.Unknown,
  user: null,
  films: [],
  isFilmsLoading: false,
  genre: ALL_GENRES,
};

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setFilms, (state, action) => {
      state.films = action.payload;
    })
    .addCase(setFilmsLoadingStatus, (state, action) => {
      state.isFilmsLoading = action.payload;
    })
    .addCase(setGenre, (state, action) => {
      state.genre = action.payload;
    });
});

export { reducer };
