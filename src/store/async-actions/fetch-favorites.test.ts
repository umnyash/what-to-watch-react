import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';

import { APIRoute } from '../../const';
import { getMockFilms } from '../../mocks/data';
import { setupTestStore, extractActionsTypes } from '../../tests/util';

import { fetchFavorites } from './fetch-favorites';

vi.mock('react-toastify', () => ({
  toast: {
    warn: vi.fn(),
  }
}));

describe('Async action: fetchFavorites', () => {
  let store: ReturnType<typeof setupTestStore>['store'];
  let mockAPIAdapter: ReturnType<typeof setupTestStore>['mockAPIAdapter'];

  beforeEach(() => {
    ({ store, mockAPIAdapter } = setupTestStore());
    vi.clearAllMocks();
  });

  it('should call "toast.warn" with error message on network failure', async () => {
    const networkErrorMessage = /Network error/i;
    mockAPIAdapter
      .onGet(APIRoute.Favorites)
      .networkError();

    await store.dispatch(fetchFavorites());

    expect(toast.warn).toHaveBeenCalledOnce();
    expect(toast.warn).toHaveBeenCalledWith(expect.stringMatching(networkErrorMessage));
  });

  describe('Server responds with 200 (Ok)', () => {
    it('should dispatch "fetchFavorites.pending", "fetchFavorites.fulfilled" and return films data', async () => {
      const mockFilms = getMockFilms(2);
      mockAPIAdapter
        .onGet(APIRoute.Favorites)
        .reply(StatusCodes.OK, mockFilms);

      await store.dispatch(fetchFavorites());
      const dispatchedActions = store.getActions();
      const actionsTypes = extractActionsTypes(dispatchedActions);
      const fetchFavoritesFulfilled = dispatchedActions[1];

      expect(actionsTypes).toEqual([
        fetchFavorites.pending.type,
        fetchFavorites.fulfilled.type,
      ]);
      expect(fetchFavoritesFulfilled.payload).toEqual(mockFilms);
    });
  });

  describe('Server responds with 401 (Unauthorized)', () => {
    it('should dispatch "fetchFavorites.pending" and "fetchFavorites.rejected"', async () => {
      mockAPIAdapter
        .onGet(APIRoute.Favorites)
        .reply(StatusCodes.UNAUTHORIZED);

      await store.dispatch(fetchFavorites());
      const actionsTypes = extractActionsTypes(store.getActions());

      expect(actionsTypes).toEqual([
        fetchFavorites.pending.type,
        fetchFavorites.rejected.type,
      ]);
    });

    it('should not call "toast.warn"', async () => {
      mockAPIAdapter
        .onGet(APIRoute.Favorites)
        .reply(StatusCodes.UNAUTHORIZED);

      await store.dispatch(fetchFavorites());

      expect(toast.warn).not.toHaveBeenCalled();
    });
  });
});
