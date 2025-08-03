import { createSlice } from '@reduxjs/toolkit';
import { RequestStatus, SliceName } from '../../const';
import { SimilarFilmsState } from '../../types/state';
import { fetchSimilarFilms } from '../async-actions';

const initialState: SimilarFilmsState = {
  filmId: null,
  loadingStatus: RequestStatus.Idle,
  films: [],
};

export const similarFilmsSlice = createSlice({
  name: SliceName.SimilarFilms,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchSimilarFilms.pending, (state, action) => {
        state.filmId = action.meta.arg;
        state.loadingStatus = RequestStatus.Pending;
        state.films = [];
      })
      .addCase(fetchSimilarFilms.fulfilled, (state, action) => {
        state.loadingStatus = RequestStatus.Success;
        state.films = action.payload;
      });
  },
});
