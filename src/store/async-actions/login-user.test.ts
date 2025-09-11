import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';

import { APIRoute } from '../../const';
import { AuthUser, AuthData } from '../../types/user';
import * as tokenStorage from '../../services/token';
import { getMockAuthUser } from '../../mocks/data';
import { setupTestStore, extractActionsTypes } from '../../tests/util';
import { omit } from '../../util';

import { loginUser } from './login-user';
import { fetchFavorites } from './fetch-favorites';

vi.mock('react-toastify', () => ({
  toast: {
    warn: vi.fn(),
  }
}));

describe('Async action: loginUser', () => {
  let store: ReturnType<typeof setupTestStore>['store'];
  let mockAPIAdapter: ReturnType<typeof setupTestStore>['mockAPIAdapter'];

  beforeEach(() => {
    ({ store, mockAPIAdapter } = setupTestStore());
    vi.clearAllMocks();
  });

  it('should call "toast.warn" with error message on network failure', async () => {
    const networkErrorMessage = /Network error/i;
    const mockAuthData: AuthData = { email: 'test@test.com', password: 'abc123' };
    mockAPIAdapter
      .onPost(APIRoute.Login)
      .networkError();

    await store.dispatch(loginUser(mockAuthData));

    expect(toast.warn).toHaveBeenCalledTimes(1);
    expect(toast.warn).toHaveBeenCalledWith(expect.stringMatching(networkErrorMessage));
  });

  describe('Server responds with 201 (Created)', () => {
    it('should dispatch "loginUser.pending", "loginUser.fulfilled", "fetchFavorites.pending" and return user data', async () => {
      const mockAuthData: AuthData = { email: 'test@test.com', password: 'abc123' };
      const mockAuthUser: AuthUser = getMockAuthUser();
      const mockUser = omit(mockAuthUser, 'token');
      mockAPIAdapter
        .onPost(APIRoute.Login)
        .reply(StatusCodes.CREATED, mockAuthUser);

      await store.dispatch(loginUser(mockAuthData));
      const dispatchedActions = store.getActions();
      const actionsTypes = extractActionsTypes(dispatchedActions);
      const loginUserFulfilled = dispatchedActions[1];

      expect(actionsTypes).toEqual([
        loginUser.pending.type,
        loginUser.fulfilled.type,
        fetchFavorites.pending.type,
      ]);
      expect(loginUserFulfilled.payload).toEqual(mockUser);
    });

    it('should call "saveToken" once with the received token on login', async () => {
      const mockAuthData: AuthData = { email: 'test@test.com', password: 'abc123' };
      const mockAuthUser: AuthUser = getMockAuthUser();
      mockAPIAdapter
        .onPost(APIRoute.Login)
        .reply(StatusCodes.CREATED, mockAuthUser);
      const mockSaveToken = vi.spyOn(tokenStorage, 'saveToken');

      await store.dispatch(loginUser(mockAuthData));

      expect(mockSaveToken).toHaveBeenCalledOnce();
      expect(mockSaveToken).toHaveBeenCalledWith(mockAuthUser.token);
    });
  });

  describe('Server responds with 400 (Bad Request)', () => {
    it('should dispatch "loginUser.pending" and "loginUser.rejected"', async () => {
      const mockInvalidAuthData: AuthData = { email: 'test', password: '0000' };
      mockAPIAdapter
        .onPost(APIRoute.Login)
        .reply(StatusCodes.BAD_REQUEST);

      await store.dispatch(loginUser(mockInvalidAuthData));
      const actionsTypes = extractActionsTypes(store.getActions());

      expect(actionsTypes).toEqual([
        loginUser.pending.type,
        loginUser.rejected.type,
      ]);
    });

    it('should call "toast.warn" once with error message', async () => {
      const mockInvalidAuthData: AuthData = { email: 'test', password: '0000' };
      const errorMessage = 'Bad Request';
      mockAPIAdapter
        .onPost(APIRoute.Login)
        .reply(StatusCodes.BAD_REQUEST, { message: errorMessage });

      await store.dispatch(loginUser(mockInvalidAuthData));

      expect(toast.warn).toHaveBeenCalledOnce();
      expect(toast.warn).toHaveBeenCalledWith(errorMessage);
    });
  });
});
