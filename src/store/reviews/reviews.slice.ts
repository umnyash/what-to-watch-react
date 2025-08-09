import { createSlice } from '@reduxjs/toolkit';
import { RequestStatus, SliceName } from '../../const';
import { ReviewsState } from '../../types/state';
import { fetchReviews, submitReview } from '../async-actions';

const initialState: ReviewsState = {
  filmId: null,
  loadingStatus: RequestStatus.Idle,
  reviews: [],
};

export const reviewsSlice = createSlice({
  name: SliceName.Reviews,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchReviews.pending, (state, action) => {
        state.filmId = action.meta.arg;
        state.loadingStatus = RequestStatus.Pending;
        state.reviews = [];
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        if (state.filmId === action.meta.arg) {
          state.loadingStatus = RequestStatus.Success;
          state.reviews = action.payload;
        }
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        if (state.filmId === action.meta.arg) {
          state.loadingStatus = RequestStatus.Error;
        }
      })

      .addCase(submitReview.fulfilled, (state, action) => {
        if (action.meta.arg.filmId === state.filmId) {
          state.reviews.push(action.payload);
        }
      });
  },
});
