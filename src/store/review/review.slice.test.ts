import { RequestStatus } from '../../const';
import { ReviewState } from '../../types/state';
import { submitReview } from '../async-actions';

import { reviewSlice } from './review.slice';

describe('Slice: review', () => {
  it('should return current state when action is unknown', () => {
    const expectedState: ReviewState = {
      submittingStatus: RequestStatus.Success,
    };
    const unknownAction = { type: '' };

    const result = reviewSlice.reducer(expectedState, unknownAction);

    expect(result).toEqual(expectedState);
  });

  it('should return initial state when state is undefined and action is unknown', () => {
    const initialState: ReviewState = {
      submittingStatus: RequestStatus.Idle,
    };
    const unknownAction = { type: '' };

    const result = reviewSlice.reducer(undefined, unknownAction);

    expect(result).toEqual(initialState);
  });

  describe('submitReview', () => {
    it(`should set "${RequestStatus.Pending}" submitting status on "submitReview.pending" action`, () => {
      const expectedState = {
        submittingStatus: RequestStatus.Pending,
      };

      const result = reviewSlice.reducer(undefined, submitReview.pending);

      expect(result).toEqual(expectedState);
    });

    it(`should set "${RequestStatus.Success}" submitting status on "submitReview.fulfilled" action`, () => {
      const initialState: ReviewState = {
        submittingStatus: RequestStatus.Pending,
      };
      const expectedState: ReviewState = {
        submittingStatus: RequestStatus.Success,
      };

      const result = reviewSlice.reducer(initialState, submitReview.fulfilled);

      expect(result).toEqual(expectedState);
    });

    it(`should set "${RequestStatus.Error}" submitting status on "submitReview.rejected" action`, () => {
      const initialState: ReviewState = {
        submittingStatus: RequestStatus.Pending,
      };
      const expectedState: ReviewState = {
        submittingStatus: RequestStatus.Error,
      };

      const result = reviewSlice.reducer(initialState, submitReview.rejected);

      expect(result).toEqual(expectedState);
    });
  });
});
