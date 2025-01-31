import { createReducer } from '@reduxjs/toolkit';
import { setFilms, setGenre } from './actions';
import { Films } from '../types/films';
import { ALL_GENRES } from '../const';

type InitialState = {
  films: Films;
  genre: string;
}

const initialState: InitialState = {
  films: [],
  genre: ALL_GENRES,
};

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setFilms, (state, action) => {
      state.films = action.payload;
    })
    .addCase(setGenre, (state, action) => {
      state.genre = action.payload;
    });
});

export { reducer };
