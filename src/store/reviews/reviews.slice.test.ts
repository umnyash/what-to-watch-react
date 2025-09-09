import { RequestStatus } from '../../const';
import { ReviewsState } from '../../types/state';
import { getMockReview, getMockReviews } from '../../mocks/data';
import { fetchReviews, submitReview } from '../async-actions';

import { reviewsSlice } from './reviews.slice';

describe('Slice: reviews', () => {
  const sourceFilm1Id = 'id1';
  const sourceFilm2Id = 'id2';
  const mockReviews = getMockReviews(2);

  it('should return current state when action is unknown', () => {
    const expectedState: ReviewsState = {
      filmId: sourceFilm1Id,
      loadingStatus: RequestStatus.Success,
      reviews: mockReviews,
    };
    const unknownAction = { type: '' };

    const result = reviewsSlice.reducer(expectedState, unknownAction);

    expect(result).toEqual(expectedState);
  });

  it('should return initial state when state is undefined and action is unknown', () => {
    const initialState: ReviewsState = {
      filmId: null,
      loadingStatus: RequestStatus.Idle,
      reviews: [],
    };
    const unknownAction = { type: '' };

    const result = reviewsSlice.reducer(undefined, unknownAction);

    expect(result).toEqual(initialState);
  });

  describe('fethcReviews', () => {
    it.each([
      undefined,
      {
        filmId: sourceFilm1Id,
        loadingStatus: RequestStatus.Success,
        reviews: mockReviews,
      },
      {
        filmId: sourceFilm1Id,
        loadingStatus: RequestStatus.Error,
        reviews: [],
      },
    ])(`should set filmId, ${RequestStatus.Pending} loading status and clear previous reviews data if any existed on "fetchReviews.pending" action`,
      (initialState) => {
        const expectedState: ReviewsState = {
          filmId: sourceFilm2Id,
          loadingStatus: RequestStatus.Pending,
          reviews: [],
        };

        const result = reviewsSlice.reducer(initialState, fetchReviews.pending(
          '', sourceFilm2Id
        ));

        expect(result).toEqual(expectedState);
      }
    );

    describe('fetchReviews.fulfilled', () => {
      it(`should set ${RequestStatus.Success} loading status and reviews data when filmId matches on "fetchReviews.fulfilled" action`, () => {
        const initialState: ReviewsState = {
          filmId: sourceFilm2Id,
          loadingStatus: RequestStatus.Pending,
          reviews: [],
        };
        const expectedState: ReviewsState = {
          ...initialState,
          loadingStatus: RequestStatus.Success,
          reviews: mockReviews,
        };

        const result = reviewsSlice.reducer(initialState, fetchReviews.fulfilled(
          mockReviews, '', sourceFilm2Id
        ));

        expect(result).toEqual(expectedState);
      });

      it('should ignore response when filmId mismatch on "fetchReviews.fulfilled" action', () => {
        const initialState: ReviewsState = {
          filmId: sourceFilm2Id,
          loadingStatus: RequestStatus.Pending,
          reviews: [],
        };

        const result = reviewsSlice.reducer(initialState, fetchReviews.fulfilled(
          mockReviews, '', sourceFilm1Id
        ));

        expect(result).toEqual(initialState);
      });
    });

    describe('fetchReviews.rejected', () => {
      it(`should set ${RequestStatus.Error} loading status when filmId matches on "fetchReviews.rejected" action`, () => {
        const initialState: ReviewsState = {
          filmId: sourceFilm2Id,
          loadingStatus: RequestStatus.Pending,
          reviews: [],
        };
        const expectedState: ReviewsState = {
          ...initialState,
          loadingStatus: RequestStatus.Error,
        };

        const result = reviewsSlice.reducer(initialState, fetchReviews.rejected(
          null, '', sourceFilm2Id
        ));

        expect(result).toEqual(expectedState);
      });

      it('should ignore error when filmId mismatch on "fetchReviews.rejected" action (stale response)', () => {
        const initialState: ReviewsState = {
          filmId: sourceFilm2Id,
          loadingStatus: RequestStatus.Pending,
          reviews: [],
        };

        const result = reviewsSlice.reducer(initialState, fetchReviews.rejected(
          null, '', sourceFilm1Id
        ));

        expect(result).toEqual(initialState);
      });
    });
  });

  describe('submitReview', () => {
    const newMockReview = getMockReview();
    const newMockReviewContent = { rating: newMockReview.rating, comment: newMockReview.comment };

    it.each([
      {
        filmId: null,
        loadingStatus: RequestStatus.Idle,
        reviews: [],
      },
      {
        filmId: sourceFilm1Id,
        loadingStatus: RequestStatus.Success,
        reviews: mockReviews,
      },
    ])('should not add new review to reviews data when film ID not matches on "submitReview.fulfilled" action',
      (initialState) => {
        const result = reviewsSlice.reducer(initialState, submitReview.fulfilled(
          newMockReview, '', { filmId: sourceFilm2Id, content: newMockReviewContent }
        ));

        expect(result).toEqual(initialState);
      }
    );

    it('should add new review to reviews data when film ID matches on "submitReview.fulfilled" action', () => {
      const initialState: ReviewsState = {
        filmId: sourceFilm1Id,
        loadingStatus: RequestStatus.Success,
        reviews: mockReviews,
      };
      const expectedState: ReviewsState = {
        ...initialState,
        reviews: [...mockReviews, newMockReview],
      };

      const result = reviewsSlice.reducer(initialState, submitReview.fulfilled(
        newMockReview, '', { filmId: sourceFilm1Id, content: newMockReviewContent }
      ));

      expect(result).toEqual(expectedState);
    });
  });
});
