import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';

import { APIRoute } from '../../const';
import { getMockPromoFilm } from '../../mocks/data';
import { setupTestStore, extractActionsTypes } from '../../tests/util';

import { fetchPromoFilm } from './fetch-promo-film';

vi.mock('react-toastify', () => ({
  toast: {
    warn: vi.fn(),
  }
}));

describe('Async action: fetchPromoFilm', () => {
  let store: ReturnType<typeof setupTestStore>['store'];
  let mockAPIAdapter: ReturnType<typeof setupTestStore>['mockAPIAdapter'];

  beforeEach(() => {
    ({ store, mockAPIAdapter } = setupTestStore());
    vi.clearAllMocks();
  });

  it('should call "toast.warn" with error message on network failure', async () => {
    const networkErrorMessage = /Network error/i;
    mockAPIAdapter.onGet(APIRoute.Promo).networkError();

    await store.dispatch(fetchPromoFilm());

    expect(toast.warn).toHaveBeenCalledTimes(1);
    expect(toast.warn).toHaveBeenCalledWith(expect.stringMatching(networkErrorMessage));
  });

  describe('Server responds with 200 (Ok)', () => {
    it('should dispatch "fetchPromoFilm.pending", "fetchPromoFilm.fulfilled" and return film data', async () => {
      const mockFilm = getMockPromoFilm();
      mockAPIAdapter
        .onGet(APIRoute.Promo)
        .reply(StatusCodes.OK, mockFilm);

      await store.dispatch(fetchPromoFilm());
      const dispatchedActions = store.getActions();
      const actionsTypes = extractActionsTypes(dispatchedActions);
      const fetchPromoFilmFulfilled = dispatchedActions[1];

      expect(actionsTypes).toEqual([
        fetchPromoFilm.pending.type,
        fetchPromoFilm.fulfilled.type,
      ]);
      expect(fetchPromoFilmFulfilled.payload).toEqual(mockFilm);
    });
  });
});
