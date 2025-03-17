import { createSlice } from '@reduxjs/toolkit';
import { SliceName, AuthorizationStatus, RequestStatus, ERROR_PLACEHOLDER_MESSAGE } from '../../const';
import { UserState } from '../../types/state';
import { checkUserAuth, loginUser, logoutUser } from '../async-actions';

const initialState: UserState = {
  authorizationStatus: AuthorizationStatus.Unknown,
  user: null,
  loggingInStatus: RequestStatus.Idle,
  loginErrorData: null,
};

export const user = createSlice({
  name: SliceName.User,
  initialState,
  reducers: {
    clearLoginErrorData: (state) => {
      state.loginErrorData = null;
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
        state.loginErrorData = null;
        state.loggingInStatus = RequestStatus.Pending;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.authorizationStatus = AuthorizationStatus.Auth;
        state.user = action.payload;
        state.loggingInStatus = RequestStatus.Success;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginErrorData = action.payload ?? { message: ERROR_PLACEHOLDER_MESSAGE };
        state.loggingInStatus = RequestStatus.Error;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        state.user = null;
      });
  },
});

export const userActions = user.actions;
