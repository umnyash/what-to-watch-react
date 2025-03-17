import { createSlice } from '@reduxjs/toolkit';
import { SliceName } from '../../const';
import { SimilarFilmsState } from '../../types/state';
import { fetchSimilarFilms } from '../async-actions';

const initialState: SimilarFilmsState = {
  films: [],
};

export const similarFilms = createSlice({
  name: SliceName.SimilarFilms,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchSimilarFilms.fulfilled, (state, action) => {
        state.films = action.payload;
      });
  },
});
