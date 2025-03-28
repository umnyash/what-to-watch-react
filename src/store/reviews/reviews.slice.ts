import { createSlice } from '@reduxjs/toolkit';
import { SliceName, RequestStatus } from '../../const';
import { ReviewsState } from '../../types/state';
import { fetchReviews, submitReview } from '../async-actions';

const initialState: ReviewsState = {
  filmId: null,
  reviews: [],
  reviewSubmittingStatus: RequestStatus.Idle,
};

export const reviews = createSlice({
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

      .addCase(submitReview.pending, (state) => {
        state.reviewSubmittingStatus = RequestStatus.Pending;
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.reviews.push(action.payload);
        state.reviewSubmittingStatus = RequestStatus.Success;
      })
      .addCase(submitReview.rejected, (state) => {
        state.reviewSubmittingStatus = RequestStatus.Error;
      });
  },
});
