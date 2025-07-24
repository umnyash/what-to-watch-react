import { createSlice } from '@reduxjs/toolkit';
import { SliceName, RequestStatus } from '../../const';
import { ReviewState } from '../../types/state';
import { submitReview } from '../async-actions';

const initialState: ReviewState = {
  submittingStatus: RequestStatus.Idle,
};

export const reviewSlice = createSlice({
  name: SliceName.Review,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(submitReview.pending, (state) => {
        state.submittingStatus = RequestStatus.Pending;
      })
      .addCase(submitReview.fulfilled, (state) => {
        state.submittingStatus = RequestStatus.Success;
      })
      .addCase(submitReview.rejected, (state) => {
        state.submittingStatus = RequestStatus.Error;
      });
  },
});
