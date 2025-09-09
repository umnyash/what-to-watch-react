import { ERROR_PLACEHOLDER_MESSAGE, RequestStatus, AuthorizationStatus } from '../../const';
import { UNEXPECTED_ERROR } from '../../services/api';
import { UserState } from '../../types/state';
import { AuthData } from '../../types/user';
import { getMockUser } from '../../mocks/data';
import { checkUserAuth, loginUser, logoutUser } from '../async-actions';

import { userSlice } from './user.slice';

describe('Slice: user', () => {
  const mockUser = getMockUser();

  it('should return current state when action is unknown', () => {
    const expectedState: UserState = {
      authorizationStatus: AuthorizationStatus.Auth,
      user: mockUser,
      loggingInStatus: RequestStatus.Success,
      loginError: null,
    };
    const unknownAction = { type: '' };

    const result = userSlice.reducer(expectedState, unknownAction);

    expect(result).toEqual(expectedState);
  });

  it('should return initial state when state is undefined and action is unknown', () => {
    const initialState: UserState = {
      authorizationStatus: AuthorizationStatus.Unknown,
      user: null,
      loggingInStatus: RequestStatus.Idle,
      loginError: null,
    };
    const unknownAction = { type: '' };

    const result = userSlice.reducer(undefined, unknownAction);

    expect(result).toEqual(initialState);
  });

  describe('checkUserAuth', () => {
    it(`should set user data and "${AuthorizationStatus.Auth}" authorization status on "checkUserAuth.fulfilled" action`, () => {
      const expectedState: UserState = {
        authorizationStatus: AuthorizationStatus.Auth,
        user: mockUser,
        loggingInStatus: RequestStatus.Idle,
        loginError: null,
      };

      const result = userSlice.reducer(undefined, checkUserAuth.fulfilled(
        mockUser, '', undefined
      ));

      expect(result).toEqual(expectedState);
    });

    it(`should set "${AuthorizationStatus.NoAuth}" authorization status on "checkUserAuth.rejected" action`, () => {
      const expectedState: UserState = {
        authorizationStatus: AuthorizationStatus.NoAuth,
        user: null,
        loggingInStatus: RequestStatus.Idle,
        loginError: null,
      };

      const result = userSlice.reducer(undefined, checkUserAuth.rejected);

      expect(result).toEqual(expectedState);
    });
  });

  describe('loginUser', () => {
    let initialState: UserState;
    const mockAuthData: AuthData = { email: 'test@test.com', password: 'abc123' };

    beforeEach(() => {
      initialState = {
        authorizationStatus: AuthorizationStatus.NoAuth,
        user: null,
        loggingInStatus: RequestStatus.Idle,
        loginError: null,
      };
    });

    it(`should set "${RequestStatus.Pending}" logging in status on "loginUser.pending" action`, () => {
      const expectedState: UserState = {
        ...initialState,
        loggingInStatus: RequestStatus.Pending,
      };

      const result = userSlice.reducer(initialState, loginUser.pending);

      expect(result).toEqual(expectedState);
    });

    it(`should set user data, "${AuthorizationStatus.Auth}" authorization status and "${RequestStatus.Success}" logging in status on "loginUser.fulfilled" action`, () => {
      const expectedState: UserState = {
        ...initialState,
        authorizationStatus: AuthorizationStatus.Auth,
        user: mockUser,
        loggingInStatus: RequestStatus.Success,
      };

      const result = userSlice.reducer(initialState, loginUser.fulfilled(
        mockUser, '', mockAuthData
      ));

      expect(result).toEqual(expectedState);
    });

    it.each([
      ['error data from payload', UNEXPECTED_ERROR],
      ['fallback error message when no payload', undefined]
    ])(`should set "${RequestStatus.Error}" logging in status and %s on "loginUser.rejected" action`, (_error, payload) => {
      initialState.loggingInStatus = RequestStatus.Pending;
      const expectedState = {
        ...initialState,
        loggingInStatus: RequestStatus.Error,
        loginError: payload ?? ERROR_PLACEHOLDER_MESSAGE,
      };

      const result = userSlice.reducer(initialState, loginUser.rejected(
        null, '', mockAuthData, payload
      ));

      expect(result).toEqual(expectedState);
    });
  });

  describe('logoutUser', () => {
    it(`should clear user data and set "${AuthorizationStatus.NoAuth}" authorization status on "logoutUser.fulfilled" action`, () => {
      const initialState: UserState = {
        authorizationStatus: AuthorizationStatus.Auth,
        user: mockUser,
        loggingInStatus: RequestStatus.Success,
        loginError: null,
      };
      const expectedState: UserState = {
        authorizationStatus: AuthorizationStatus.NoAuth,
        user: null,
        loggingInStatus: RequestStatus.Idle,
        loginError: null,
      };

      const result = userSlice.reducer(initialState, logoutUser.fulfilled);

      expect(result).toEqual(expectedState);
    });
  });
});
