import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';

import { APIRoute } from '../../const';
import { getMockFilms } from '../../mocks/data';
import { setupTestStore, extractActionsTypes } from '../../tests/util';

import { fetchFilms } from './fetch-films';

vi.mock('react-toastify', () => ({
  toast: {
    warn: vi.fn(),
  }
}));

describe('Async action: fetchFilms', () => {
  let store: ReturnType<typeof setupTestStore>['store'];
  let mockAPIAdapter: ReturnType<typeof setupTestStore>['mockAPIAdapter'];

  beforeEach(() => {
    ({ store, mockAPIAdapter } = setupTestStore());
    vi.clearAllMocks();
  });

  it('should call "toast.warn" with error message on network failure', async () => {
    const networkErrorMessage = /Network error/i;
    mockAPIAdapter.onGet(APIRoute.Films).networkError();

    await store.dispatch(fetchFilms());

    expect(toast.warn).toHaveBeenCalledTimes(1);
    expect(toast.warn).toHaveBeenCalledWith(expect.stringMatching(networkErrorMessage));
  });

  describe('Server responds with 200 (Ok)', () => {
    it('should dispatch "fetchFilms.pending", "fetchFilms.fulfilled" and return films data', async () => {
      const mockFilms = getMockFilms(2);
      mockAPIAdapter
        .onGet(APIRoute.Films)
        .reply(StatusCodes.OK, mockFilms);

      await store.dispatch(fetchFilms());
      const dispatchedActions = store.getActions();
      const actionsTypes = extractActionsTypes(dispatchedActions);
      const fetchFilmsFulfilled = dispatchedActions[1];

      expect(actionsTypes).toEqual([
        fetchFilms.pending.type,
        fetchFilms.fulfilled.type,
      ]);
      expect(fetchFilmsFulfilled.payload).toEqual(mockFilms);
    });
  });
});
