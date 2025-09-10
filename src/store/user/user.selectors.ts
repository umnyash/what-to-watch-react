import { State } from '../../types/state';
import { SliceName, AuthorizationStatus, RequestStatus, ERROR_PLACEHOLDER_MESSAGE } from '../../const';
import { loginResponseErrorDetailMessages } from '../../services/api/const';
import { validationErrorMessages } from '../../validation';

const sliceName = SliceName.User;
type SliceState = Pick<State, SliceName.User>;

const authorizationStatus = (state: SliceState) => state[sliceName].authorizationStatus;
const isAuthChecked = (state: SliceState) => state[sliceName].authorizationStatus !== AuthorizationStatus.Unknown;
const isAuth = (state: SliceState) => state[sliceName].authorizationStatus === AuthorizationStatus.Auth;
const isNoAuth = (state: SliceState) => state[sliceName].authorizationStatus === AuthorizationStatus.NoAuth;
const isLoggingIn = (state: SliceState) => state[sliceName].loggingInStatus === RequestStatus.Pending;

const loginErrorMessage = (state: SliceState) => {
  const error = state[sliceName].loginError;

  if (!error) {
    return null;
  }

  if (typeof error !== 'string' && error.data?.details.length) {
    const allMessages = loginResponseErrorDetailMessages;

    const currentMessages = error.data.details.reduce((acc: Record<string, boolean>, detail) => {
      detail.messages.forEach((message) => {
        acc[message] = true;
      });

      return acc;
    }, {});

    if (currentMessages[allMessages.email.required] && currentMessages[allMessages.password.required]) {
      return validationErrorMessages.emailAndPassword.required;
    }

    const emailErrorMessage =
      (currentMessages[allMessages.email.required] && validationErrorMessages.email.required) ||
      (currentMessages[allMessages.email.pattern] && validationErrorMessages.email.pattern) ||
      '';

    const passwordErrorMessage =
      (currentMessages[allMessages.password.required] && validationErrorMessages.password.required) ||
      (currentMessages[allMessages.password.pattern] && validationErrorMessages.password.pattern) ||
      (currentMessages[allMessages.password.minLength] && validationErrorMessages.password.minLength) ||
      '';

    return `${emailErrorMessage} ${passwordErrorMessage}`.trim();
  }

  return ERROR_PLACEHOLDER_MESSAGE;
};

const user = (state: SliceState) => state[sliceName].user;

export const userSelectors = {
  authorizationStatus,
  isAuthChecked,
  isAuth,
  isNoAuth,
  isLoggingIn,
  loginErrorMessage,
  user,
};
