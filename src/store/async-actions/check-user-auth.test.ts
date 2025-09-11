import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';

import { APIRoute } from '../../const';
import { getMockUser } from '../../mocks/data';
import { setupTestStore, extractActionsTypes } from '../../tests/util';

import { checkUserAuth } from './check-user-auth';
import { fetchFavorites } from './fetch-favorites';

vi.mock('react-toastify', () => ({
  toast: {
    warn: vi.fn(),
  }
}));

describe('Async action: checkUserAuth', () => {
  let store: ReturnType<typeof setupTestStore>['store'];
  let mockAPIAdapter: ReturnType<typeof setupTestStore>['mockAPIAdapter'];

  beforeEach(() => {
    ({ store, mockAPIAdapter } = setupTestStore());
    vi.clearAllMocks();
  });

  it('should call "toast.warn" with error message on network failure', async () => {
    const networkErrorMessage = /Network error/i;
    mockAPIAdapter.onGet(APIRoute.Login).networkError();

    await store.dispatch(checkUserAuth());

    expect(toast.warn).toHaveBeenCalledTimes(1);
    expect(toast.warn).toHaveBeenCalledWith(expect.stringMatching(networkErrorMessage));
  });

  describe('Server responds with 200 (Ok)', () => {
    it('should dispatch "checkUserAuth.pending", "checkUserAuth.fulfilled", "fetchFavorites.pending" and return user data', async () => {
      const mockUser = getMockUser();

      mockAPIAdapter
        .onGet(APIRoute.Login).reply(StatusCodes.OK, mockUser)
        .onGet(APIRoute.Favorites).reply(StatusCodes.OK, []);

      await store.dispatch(checkUserAuth());
      const dispatchedActions = store.getActions();
      const actionsTypes = extractActionsTypes(dispatchedActions);
      const checkUserAuthFulfilled = dispatchedActions[1];

      expect(actionsTypes).toEqual([
        checkUserAuth.pending.type,
        checkUserAuth.fulfilled.type,
        fetchFavorites.pending.type,
      ]);
      expect(checkUserAuthFulfilled.payload).toMatchObject(mockUser);
    });
  });

  describe('Server responds with 401 (Unauthorized)', () => {
    it('should dispatch "checkUserAuth.pending" and "checkUserAuth.rejected"', async () => {
      mockAPIAdapter
        .onGet(APIRoute.Login)
        .reply(StatusCodes.UNAUTHORIZED);

      await store.dispatch(checkUserAuth());
      const actionsTypes = extractActionsTypes(store.getActions());

      expect(actionsTypes).toEqual([
        checkUserAuth.pending.type,
        checkUserAuth.rejected.type,
      ]);
    });

    it('should not call "toast.warn"', async () => {
      mockAPIAdapter
        .onGet(APIRoute.Login)
        .reply(StatusCodes.UNAUTHORIZED);

      await store.dispatch(checkUserAuth());

      expect(toast.warn).not.toHaveBeenCalled();
    });
  });
});
