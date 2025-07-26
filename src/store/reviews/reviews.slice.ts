import { createSlice } from '@reduxjs/toolkit';
import { SliceName } from '../../const';
import { ReviewsState } from '../../types/state';
import { fetchReviews, submitReview } from '../async-actions';

const initialState: ReviewsState = {
  filmId: null,
  reviews: [],
};

export const reviewsSlice = createSlice({
  name: SliceName.Reviews,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.filmId = null;
        state.reviews = [];
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.filmId = action.meta.arg;
        state.reviews = action.payload;
      })

      .addCase(submitReview.fulfilled, (state, action) => {
        if (action.meta.arg.filmId === state.filmId) {
          state.reviews.push(action.payload);
        }
      });
  },
});
