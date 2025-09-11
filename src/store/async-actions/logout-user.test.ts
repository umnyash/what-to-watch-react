import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';

import { APIRoute } from '../../const';
import * as tokenStorage from '../../services/token';
import { setupTestStore, extractActionsTypes } from '../../tests/util';

import { logoutUser } from './logout-user';

vi.mock('react-toastify', () => ({
  toast: {
    warn: vi.fn(),
  }
}));

describe('Async action: logoutUser', () => {
  let store: ReturnType<typeof setupTestStore>['store'];
  let mockAPIAdapter: ReturnType<typeof setupTestStore>['mockAPIAdapter'];

  beforeEach(() => {
    ({ store, mockAPIAdapter } = setupTestStore());
    vi.clearAllMocks();
  });

  it('should call "toast.warn" with error message on network failure', async () => {
    const networkErrorMessage = /Network error/i;
    mockAPIAdapter.onDelete(APIRoute.Logout).networkError();

    await store.dispatch(logoutUser());

    expect(toast.warn).toHaveBeenCalledTimes(1);
    expect(toast.warn).toHaveBeenCalledWith(expect.stringMatching(networkErrorMessage));
  });

  describe('Server responds with 204 (No Content)', () => {
    it('should dispatch "logoutUser.pending" and "logoutUser.fulfilled"', async () => {
      mockAPIAdapter
        .onDelete(APIRoute.Logout)
        .reply(StatusCodes.NO_CONTENT);

      await store.dispatch(logoutUser());
      const actionsTypes = extractActionsTypes(store.getActions());

      expect(actionsTypes).toEqual([
        logoutUser.pending.type,
        logoutUser.fulfilled.type,
      ]);
    });

    it('should call "dropToken" once on logout', async () => {
      mockAPIAdapter
        .onDelete(APIRoute.Logout)
        .reply(StatusCodes.NO_CONTENT);
      const mockDropToken = vi.spyOn(tokenStorage, 'dropToken');

      await store.dispatch(logoutUser());

      expect(mockDropToken).toHaveBeenCalledOnce();
    });
  });
});
