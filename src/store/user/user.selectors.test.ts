import { RequestStatus, AuthorizationStatus, SliceName, ERROR_PLACEHOLDER_MESSAGE } from '../../const';
import { UNEXPECTED_ERROR, loginResponseErrorDetailMessages } from '../../services/api';
import { validationErrorMessages } from '../../validation';
import { State } from '../../types/state';
import { getMockUser, getMockLoginError } from '../../mocks/data';

import { userSelectors } from './user.selectors';

describe('Selectors: user', () => {
  const sliceName = SliceName.User;

  const state: Pick<State, SliceName.User> = {
    [sliceName]: {
      authorizationStatus: AuthorizationStatus.Auth,
      user: getMockUser(),
      loggingInStatus: RequestStatus.Success,
      loginError: null,
    }
  };

  it('should return authorizationStatus from state', () => {
    const { authorizationStatus } = state[sliceName];
    const result = userSelectors.authorizationStatus(state);
    expect(result).toEqual(authorizationStatus);
  });

  it.each([
    [AuthorizationStatus.Unknown, false, false, false],
    [AuthorizationStatus.NoAuth, true, true, false],
    [AuthorizationStatus.Auth, true, false, true],
  ])(
    'when authorization status is %s – isAuthChecked → %s, isAuth → %s, isNoAuth → %s',
    (authorizationStatus, expectedIsAuthCheckedValue, expectedIsNoAuthValue, expectedIsAuthValue) => {
      state[sliceName].authorizationStatus = authorizationStatus;

      expect(userSelectors.isAuthChecked(state)).toBe(expectedIsAuthCheckedValue);
      expect(userSelectors.isNoAuth(state)).toBe(expectedIsNoAuthValue);
      expect(userSelectors.isAuth(state)).toBe(expectedIsAuthValue);
    }
  );

  it.each([
    [false, RequestStatus.Idle],
    [true, RequestStatus.Pending],
    [false, RequestStatus.Success],
    [false, RequestStatus.Error],
  ])('isLoggingIn should return %s when request status is %s', (expected, requestStatus) => {
    state[sliceName].loggingInStatus = requestStatus;
    const result = userSelectors.isLoggingIn(state);
    expect(result).toBe(expected);
  });

  describe('loginErrorMessage', () => {
    it('should return null when error is null', () => {
      state[sliceName].loginError = null;
      const result = userSelectors.loginErrorMessage(state);
      expect(result).toBe(null);
    });

    it('should return fallback error message when error is string (not null, not ErrorResponse)', () => {
      state[sliceName].loginError = UNEXPECTED_ERROR;
      const result = userSelectors.loginErrorMessage(state);
      expect(result).toBe(ERROR_PLACEHOLDER_MESSAGE);
    });

    describe('should return validation error message', () => {
      const {
        email: {
          required: emailRequired,
          pattern: emailPattern,
        },
        password: {
          required: passwordRequired,
          pattern: passwordPattern,
          minLength: passwordMinLength,
        }
      } = loginResponseErrorDetailMessages;

      describe('should return priority message from all error messages of property', () => {
        it.each([
          {
            expected: 'email required message',
            errorMessages: [emailRequired],
            expectedMessage: validationErrorMessages.email.required,
          },
          {
            expected: 'email required message (ignoring pattern)',
            errorMessages: [emailRequired, emailPattern],
            expectedMessage: validationErrorMessages.email.required,
          },
          {
            expected: 'email pattern message',
            errorMessages: [emailPattern],
            expectedMessage: validationErrorMessages.email.pattern,
          },
          {
            expected: 'password required message',
            errorMessages: [passwordRequired],
            expectedMessage: validationErrorMessages.password.required,
          },
          {
            expected: 'password required message (ignoring pattern and length)',
            errorMessages: [passwordRequired, passwordPattern, passwordMinLength],
            expectedMessage: validationErrorMessages.password.required,
          },
          {
            expected: 'password pattern message',
            errorMessages: [passwordPattern],
            expectedMessage: validationErrorMessages.password.pattern,
          },
          {
            expected: 'password pattern message (ignoring length)',
            errorMessages: [passwordPattern, passwordMinLength],
            expectedMessage: validationErrorMessages.password.pattern,
          },
          {
            expected: 'password length message',
            errorMessages: [passwordMinLength],
            expectedMessage: validationErrorMessages.password.minLength,
          },
        ])('should return $expected', ({ errorMessages, expectedMessage }) => {
          state[sliceName].loginError = getMockLoginError(...errorMessages);

          const result = userSelectors.loginErrorMessage(state);
          expect(result).toBe(expectedMessage);
        });
      });

      it('should return special message when email and password are empty', () => {
        state[sliceName].loginError = getMockLoginError(
          passwordMinLength, passwordRequired, emailPattern, emailRequired, passwordPattern
        );

        const result = userSelectors.loginErrorMessage(state);
        expect(result).toBe(validationErrorMessages.emailAndPassword.required);
      });

      describe('should return joined message from priority error messages of each field when email or password is not empty but not valid', () => {
        it.each([
          {
            expected: 'email required and password pattern message',
            errorMessages: [emailRequired, passwordPattern],
            expectedMessage: `${validationErrorMessages.email.required} ${validationErrorMessages.password.pattern}`,
          },
          {
            expected: 'email required and password length message',
            errorMessages: [emailRequired, passwordMinLength],
            expectedMessage: `${validationErrorMessages.email.required} ${validationErrorMessages.password.minLength}`,
          },
          {
            expected: 'email pattern and password required message',
            errorMessages: [emailPattern, passwordRequired],
            expectedMessage: `${validationErrorMessages.email.pattern} ${validationErrorMessages.password.required}`,
          },
          {
            expected: 'email pattern and password pattern message',
            errorMessages: [emailPattern, passwordPattern],
            expectedMessage: `${validationErrorMessages.email.pattern} ${validationErrorMessages.password.pattern}`,
          },
          {
            expected: 'email pattern and password length message',
            errorMessages: [emailPattern, passwordMinLength],
            expectedMessage: `${validationErrorMessages.email.pattern} ${validationErrorMessages.password.minLength}`,
          },
        ])('should return $expected', ({ errorMessages, expectedMessage }) => {
          state[sliceName].loginError = getMockLoginError(...errorMessages);

          const result = userSelectors.loginErrorMessage(state);
          expect(result).toBe(expectedMessage);
        });
      });
    });
  });

  it('should return user from state', () => {
    const { user } = state[sliceName];
    const result = userSelectors.user(state);
    expect(result).toEqual(user);
  });
});
