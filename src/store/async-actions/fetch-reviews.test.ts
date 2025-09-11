import { generatePath } from 'react-router-dom';
import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';

import { APIRoute } from '../../const';
import { getMockReviews } from '../../mocks/data';
import { setupTestStore, extractActionsTypes } from '../../tests/util';

import { fetchReviews } from './fetch-reviews';

vi.mock('react-toastify', () => ({
  toast: {
    warn: vi.fn(),
  }
}));

describe('Async function: fetchReviews', () => {
  let store: ReturnType<typeof setupTestStore>['store'];
  let mockAPIAdapter: ReturnType<typeof setupTestStore>['mockAPIAdapter'];

  beforeEach(() => {
    ({ store, mockAPIAdapter } = setupTestStore());
    vi.clearAllMocks();
  });

  it('should call "toast.warn" with error message on network failure', async () => {
    const networkErrorMessage = /Network error/i;
    mockAPIAdapter
      .onGet(generatePath(APIRoute.Reviews, { id: 'existingOfferId' }))
      .networkError();

    await store.dispatch(fetchReviews('existingOfferId'));

    expect(toast.warn).toHaveBeenCalledTimes(1);
    expect(toast.warn).toHaveBeenCalledWith(expect.stringMatching(networkErrorMessage));
  });

  describe('Server responds with 200 (Ok)', () => {
    it('should dispatch "fetchReviews.pending", "fetchReviews.fulfilled" and return reviews data', async () => {
      const existentFilmId = 'ee55de9e-b8c3-4ea5-9c93-e0b15f3ba0ba';
      const mockReviews = getMockReviews(2);
      mockAPIAdapter
        .onGet(generatePath(APIRoute.Reviews, { id: existentFilmId }))
        .reply(StatusCodes.OK, mockReviews);

      await store.dispatch(fetchReviews(existentFilmId));
      const dispatchedActions = store.getActions();
      const actionsTypes = extractActionsTypes(dispatchedActions);
      const fetchReviewsFulfilled = dispatchedActions[1];

      expect(actionsTypes).toEqual([
        fetchReviews.pending.type,
        fetchReviews.fulfilled.type,
      ]);
      expect(fetchReviewsFulfilled.payload).toEqual(mockReviews);
    });
  });

  describe('Server responds with 404 (Not Found)', () => {
    const nonExistentFilmId = '0000';

    it('should dispatch "fetchReviews.pending" and "fetchReviews.rejected"', async () => {
      mockAPIAdapter
        .onGet(generatePath(APIRoute.Reviews, { id: nonExistentFilmId }))
        .reply(StatusCodes.NOT_FOUND);

      await store.dispatch(fetchReviews(nonExistentFilmId));
      const actionsTypes = extractActionsTypes(store.getActions());

      expect(actionsTypes).toEqual([
        fetchReviews.pending.type,
        fetchReviews.rejected.type,
      ]);
    });

    it('should not call "toast.warn"', async () => {
      mockAPIAdapter
        .onGet(generatePath(APIRoute.Reviews, { id: nonExistentFilmId }))
        .reply(StatusCodes.NOT_FOUND);

      await store.dispatch(fetchReviews(nonExistentFilmId));

      expect(toast.warn).not.toHaveBeenCalled();
    });
  });
});
