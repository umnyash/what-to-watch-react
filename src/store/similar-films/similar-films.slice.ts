import { createSlice } from '@reduxjs/toolkit';
import { SliceName } from '../../const';
import { SimilarFilmsState } from '../../types/state';
import { fetchSimilarFilms } from '../async-actions';

const initialState: SimilarFilmsState = {
  filmId: null,
  films: [],
};

export const similarFilms = createSlice({
  name: SliceName.SimilarFilms,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchSimilarFilms.pending, (state) => {
        state.filmId = null;
        state.films = [];
      })
      .addCase(fetchSimilarFilms.fulfilled, (state, action) => {
        state.filmId = action.meta.arg;
        state.films = action.payload;
      });
  },
});
