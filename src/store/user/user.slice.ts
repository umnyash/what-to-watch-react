import { createSlice } from '@reduxjs/toolkit';
import { SliceName, AuthorizationStatus, RequestStatus, ERROR_PLACEHOLDER_MESSAGE } from '../../const';
import { UserState } from '../../types/state';
import { checkUserAuth, loginUser, logoutUser } from '../async-actions';

const initialState: UserState = {
  authorizationStatus: AuthorizationStatus.Unknown,
  user: null,
  loggingInStatus: RequestStatus.Idle,
  loginError: null,
};

export const user = createSlice({
  name: SliceName.User,
  initialState,
  reducers: {
    clearLoginErrorData: (state) => {
      state.loginError = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.authorizationStatus = AuthorizationStatus.Auth;
        state.user = action.payload;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
      })

      .addCase(loginUser.pending, (state) => {
        state.loginError = null;
        state.loggingInStatus = RequestStatus.Pending;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.authorizationStatus = AuthorizationStatus.Auth;
        state.user = action.payload;
        state.loggingInStatus = RequestStatus.Success;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginError = action.payload ?? ERROR_PLACEHOLDER_MESSAGE;
        state.loggingInStatus = RequestStatus.Error;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        state.user = null;
      });
  },
});

export const userActions = user.actions;
