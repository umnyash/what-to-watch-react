import { generatePath } from 'react-router-dom';
import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';

import { APIRoute } from '../../const';
import { getMockFilms } from '../../mocks/data';
import { setupTestStore, extractActionsTypes } from '../../tests/util';

import { fetchSimilarFilms } from './fetch-similar-films';

vi.mock('react-toastify', () => ({
  toast: {
    warn: vi.fn(),
  }
}));

describe('Async action: fetchSimilarFilms', () => {
  let store: ReturnType<typeof setupTestStore>['store'];
  let mockAPIAdapter: ReturnType<typeof setupTestStore>['mockAPIAdapter'];

  beforeEach(() => {
    ({ store, mockAPIAdapter } = setupTestStore());
    vi.clearAllMocks();
  });

  it('should call "toast.warn" with error message on network failure', async () => {
    const networkErrorMessage = /Network error/i;
    mockAPIAdapter
      .onGet(generatePath(APIRoute.SimilarFilms, { id: 'existingFilmId' }))
      .networkError();

    await store.dispatch(fetchSimilarFilms('existingFilmId'));

    expect(toast.warn).toHaveBeenCalledTimes(1);
    expect(toast.warn).toHaveBeenCalledWith(expect.stringMatching(networkErrorMessage));
  });

  describe('Server responds with 200 (Ok)', () => {
    it('should dispatch "fetchSimilarFilms.pending", "fetchSimilarFilms.fulfilled" and return films data', async () => {
      const existentFilmId = 'ee55de9e-b8c3-4ea5-9c93-e0b15f3ba0ba';
      const mockFilms = getMockFilms(2);
      mockAPIAdapter
        .onGet(generatePath(APIRoute.SimilarFilms, { id: existentFilmId }))
        .reply(StatusCodes.OK, mockFilms);

      await store.dispatch(fetchSimilarFilms(existentFilmId));
      const dispatchedAcitons = store.getActions();
      const actionsTypes = extractActionsTypes(dispatchedAcitons);
      const fetchSimilarFilmsFulfilled = dispatchedAcitons[1];

      expect(actionsTypes).toEqual([
        fetchSimilarFilms.pending.type,
        fetchSimilarFilms.fulfilled.type,
      ]);
      expect(fetchSimilarFilmsFulfilled.payload).toEqual(mockFilms);
    });
  });

  describe('Server responds with 404 (Not Found)', () => {
    const nonExistentFilmId = '0000';

    it('should dispatch "fetchSimilarFilms.pending" and "fetchSimilarFilms.rejected"', async () => {
      mockAPIAdapter
        .onGet(generatePath(APIRoute.SimilarFilms, { id: nonExistentFilmId }))
        .reply(StatusCodes.NOT_FOUND);

      await store.dispatch(fetchSimilarFilms(nonExistentFilmId));
      const actionsTypes = extractActionsTypes(store.getActions());

      expect(actionsTypes).toEqual([
        fetchSimilarFilms.pending.type,
        fetchSimilarFilms.rejected.type,
      ]);
    });

    it('should not call "toast.warn"', async () => {
      mockAPIAdapter
        .onGet(generatePath(APIRoute.SimilarFilms, { id: nonExistentFilmId }))
        .reply(StatusCodes.NOT_FOUND);

      await store.dispatch(fetchSimilarFilms(nonExistentFilmId));

      expect(toast.warn).not.toHaveBeenCalled();
    });
  });
});
