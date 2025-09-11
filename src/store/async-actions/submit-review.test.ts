import { generatePath } from 'react-router-dom';
import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';

import { APIRoute } from '../../const';
import { getMockReview } from '../../mocks/data';
import { setupTestStore, extractActionsTypes } from '../../tests/util';

import { submitReview } from './submit-review';

vi.mock('react-toastify', () => ({
  toast: {
    warn: vi.fn(),
  }
}));

describe('Async action: submitReview', () => {
  let store: ReturnType<typeof setupTestStore>['store'];
  let mockAPIAdapter: ReturnType<typeof setupTestStore>['mockAPIAdapter'];
  const existentFilmId = 'ee55de9e-b8c3-4ea5-9c93-e0b15f3ba0ba';

  beforeEach(() => {
    ({ store, mockAPIAdapter } = setupTestStore());
    vi.clearAllMocks();
  });

  it('should call "toast.warn" with error message on network failure', async () => {
    const networkErrorMessage = /Network error/i;
    const mockNewReview = getMockReview();
    const mockNewReviewContent = { rating: mockNewReview.rating, comment: mockNewReview.comment };
    mockAPIAdapter
      .onPost(generatePath(APIRoute.Reviews, { id: 'existingFilmId' }))
      .networkError();

    await store.dispatch(submitReview({ filmId: 'existingFilmId', content: mockNewReviewContent }));

    expect(toast.warn).toHaveBeenCalledTimes(1);
    expect(toast.warn).toHaveBeenCalledWith(expect.stringMatching(networkErrorMessage));
  });

  describe('Server responds with 201 (Created)', () => {
    it('should dispatch "submitReview.pending", "submitReview.fulfilled" and return review data', async () => {
      const mockNewReview = getMockReview();
      const mockNewReviewContent = { rating: mockNewReview.rating, comment: mockNewReview.comment };
      mockAPIAdapter
        .onPost(generatePath(APIRoute.Reviews, { id: existentFilmId }))
        .reply(StatusCodes.CREATED, mockNewReview);

      await store.dispatch(submitReview({
        filmId: existentFilmId,
        content: mockNewReviewContent
      }));
      const dispatchedActions = store.getActions();
      const actionsTypes = extractActionsTypes(dispatchedActions);
      const submitReviewFulfilled = dispatchedActions[1];

      expect(actionsTypes).toEqual([
        submitReview.pending.type,
        submitReview.fulfilled.type,
      ]);
      expect(submitReviewFulfilled.payload).toEqual(mockNewReview);
    });
  });

  describe('Server responds with 400 (Bad Request)', () => {
    const mockReviewContent = { rating: 0, comment: 'comment text with invalid length' };

    it('should dispatch "submitReview.pending" and "submitReview.rejected"', async () => {
      mockAPIAdapter
        .onPost(generatePath(APIRoute.Reviews, { id: existentFilmId }))
        .reply(StatusCodes.BAD_REQUEST);

      await store.dispatch(submitReview({
        filmId: existentFilmId,
        content: mockReviewContent,
      }));
      const actionsTypes = extractActionsTypes(store.getActions());

      expect(actionsTypes).toEqual([
        submitReview.pending.type,
        submitReview.rejected.type,
      ]);
    });

    it('should call "toast.warn" once with error message', async () => {
      const errorMessage = 'Bad Request';
      mockAPIAdapter
        .onPost(generatePath(APIRoute.Reviews, { id: existentFilmId }))
        .reply(StatusCodes.BAD_REQUEST, { message: errorMessage });

      await store.dispatch(submitReview({
        filmId: existentFilmId,
        content: mockReviewContent,
      }));

      expect(toast.warn).toHaveBeenCalledOnce();
      expect(toast.warn).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('Server responds with 401 (Unauthorized)', () => {
    it('should dispatch "submitReview.pending" and "submitReview.rejected"', async () => {
      const mockReviewContent = { rating: 5, comment: 'lorem ipsum' };
      mockAPIAdapter
        .onPost(generatePath(APIRoute.Reviews, { id: existentFilmId }))
        .reply(StatusCodes.UNAUTHORIZED);

      await store.dispatch(submitReview({
        filmId: existentFilmId,
        content: mockReviewContent,
      }));
      const actionsTypes = extractActionsTypes(store.getActions());

      expect(actionsTypes).toEqual([
        submitReview.pending.type,
        submitReview.rejected.type,
      ]);
    });
  });

  describe('Server responds with 404 (Not Found)', () => {
    const nonExistentFilmId = '0000';
    const mockReviewContent = { rating: 5, comment: 'lorem ipsum' };

    it('should dispatch "submitReview.pending" and "submitReview.rejected"', async () => {
      mockAPIAdapter
        .onPost(generatePath(APIRoute.Reviews, { id: nonExistentFilmId }))
        .reply(StatusCodes.NOT_FOUND);

      await store.dispatch(submitReview({
        filmId: nonExistentFilmId,
        content: mockReviewContent
      }));
      const actionsTypes = extractActionsTypes(store.getActions());

      expect(actionsTypes).toEqual([
        submitReview.pending.type,
        submitReview.rejected.type,
      ]);
    });

    it('should not call "toast.warn"', async () => {
      mockAPIAdapter
        .onPost(generatePath(APIRoute.Reviews, { id: nonExistentFilmId }))
        .reply(StatusCodes.NOT_FOUND);

      await store.dispatch(submitReview({
        filmId: nonExistentFilmId,
        content: mockReviewContent
      }));

      expect(toast.warn).not.toHaveBeenCalled();
    });
  });
});
