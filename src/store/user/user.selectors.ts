import { State } from '../../types/state';
import { SliceName, AuthorizationStatus, RequestStatus, ERROR_PLACEHOLDER_MESSAGE, loginResponseErrorDetailMessages } from '../../const';
import { validationErrorMessages } from '../../validation';

const sliceName = SliceName.User;

const authorizationStatus = (state: State) => state[sliceName].authorizationStatus;
const isAuthChecked = (state: State) => state[sliceName].authorizationStatus !== AuthorizationStatus.Unknown;
const isAuth = (state: State) => state[sliceName].authorizationStatus === AuthorizationStatus.Auth;
const isNoAuth = (state: State) => state[sliceName].authorizationStatus === AuthorizationStatus.NoAuth;
const isLoggingIn = (state: State) => state[sliceName].loggingInStatus === RequestStatus.Pending;

const loginErrorMessage = (state: State) => {
  const data = state[sliceName].loginErrorData;

  if (!data) {
    return null;
  }

  if (typeof data !== 'string' && data.details.length) {
    const allMessages = loginResponseErrorDetailMessages;

    const currentMessages = data.details.reduce((acc: Record<string, boolean>, detail) => {
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

const user = (state: State) => state[sliceName].user;

export const userSelectors = {
  authorizationStatus,
  isAuthChecked,
  isAuth,
  isNoAuth,
  isLoggingIn,
  loginErrorMessage,
  user,
};
