import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StatusCodes } from 'http-status-codes';

import { ERROR_PLACEHOLDER_MESSAGE, APIRoute, RequestStatus, AuthorizationStatus, SliceName } from '../../const';
import { getMockAuthUser } from '../../mocks/data';
import { withStore } from '../../tests/render-helpers';
import { validationErrorMessages } from '../../validation';
import { userActions } from '../../store/user/user.slice';
import { loginUser } from '../../store/async-actions';
import { extractActionsTypes } from '../../tests/util';

import LoginForm from './login-form';

describe('Component: LoginForm (integration)', () => {
  const sliceName = SliceName.User;
  const errorMessageTestId = 'login-form-error-message';
  const emailFieldLabel = /Email address/i;
  const passwordFieldLabel = /Password/i;
  const submitButtonText = 'Sign in';
  const someValidEmail = 'test@test.com';
  const someValidPassword = 'abc123';

  it('should clear login error data and not render error message on mount', () => {
    const { withStoreComponent, store } = withStore(<LoginForm />, {
      [sliceName]: {
        authorizationStatus: AuthorizationStatus.NoAuth,
        user: null,
        loggingInStatus: RequestStatus.Error,
        loginError: ERROR_PLACEHOLDER_MESSAGE,
      }
    });

    render(withStoreComponent);
    const errorMessageElement = screen.queryByTestId(errorMessageTestId);
    const dispatchedActionsTypes = extractActionsTypes(store.getActions());
    const sliceState = store.getState()[sliceName];

    expect(dispatchedActionsTypes).toEqual([userActions.clearLoginErrorData.type]);
    expect(errorMessageElement).not.toBeInTheDocument();
    expect(sliceState).toEqual(expect.objectContaining({
      loginError: null
    }));
  });

  describe('validation', () => {
    it.each([
      {
        email: 'invalid',
        password: 'invalid',
        expectedFocusedFieldLabel: emailFieldLabel,
        errorMessage: validationErrorMessages.email.pattern,
      },
      {
        email: 'invalid',
        password: 'abc123',
        expectedFocusedFieldLabel: emailFieldLabel,
        errorMessage: validationErrorMessages.email.pattern,
      },
      {
        email: 'test@test.com',
        password: 'invalid',
        expectedFocusedFieldLabel: passwordFieldLabel,
        errorMessage: validationErrorMessages.password.pattern,
      },
    ])(
      'should prevent submission and focus first invalid field when form contains validation errors',
      async ({ email, password, expectedFocusedFieldLabel, errorMessage }) => {
        const { withStoreComponent, store } = withStore(<LoginForm />);
        const user = userEvent.setup();

        render(withStoreComponent);
        const expectedFocusedFieldElement = screen.getByLabelText(expectedFocusedFieldLabel);
        const emailFieldElement = screen.getByLabelText(emailFieldLabel);
        const passwordFieldElement = screen.getByLabelText(passwordFieldLabel);
        const submitButtonElement = screen.getByRole('button', { name: submitButtonText });
        await user.type(emailFieldElement, email);
        await user.type(passwordFieldElement, password);
        await user.click(submitButtonElement);
        const errorMessageElement = screen.getByText(errorMessage);
        const dispatchedActionsTypes = extractActionsTypes(store.getActions());

        expect(errorMessageElement).toBeInTheDocument();
        expect(dispatchedActionsTypes).not.toContain(loginUser.pending.type);
        expect(expectedFocusedFieldElement).toHaveFocus();
      }
    );

    it.each([
      {
        email: 'invalid',
        password: 'abc123',
        errorMessage: validationErrorMessages.email.pattern,
      },
      {
        email: 'test@test.com',
        password: 'invalid',
        errorMessage: validationErrorMessages.password.pattern,
      },
    ])(
      'should hide validation error message when user moves focus away from invalid field',
      async ({ email, password }) => {
        const { withStoreComponent } = withStore(<LoginForm />);
        const user = userEvent.setup();

        render(withStoreComponent);
        const emailFieldElement = screen.getByLabelText(emailFieldLabel);
        const passwordFieldElement = screen.getByLabelText(passwordFieldLabel);
        const submitButtonElement = screen.getByRole('button', { name: submitButtonText });
        await user.type(emailFieldElement, email);
        await user.type(passwordFieldElement, password);
        await user.click(submitButtonElement);
        await user.tab();
        const errorMessageElement = screen.queryByTestId(errorMessageTestId);

        expect(errorMessageElement).not.toBeInTheDocument();
      }
    );

    describe('Real-time validation feedback after failed submission', () => {
      it('should provide immediate email validation feedback as user types', async () => {
        const { withStoreComponent } = withStore(<LoginForm />);
        const user = userEvent.setup();

        render(withStoreComponent);
        const emailFieldElement = screen.getByLabelText(emailFieldLabel);
        const submitButtonElement = screen.getByRole('button', { name: submitButtonText });
        await user.click(submitButtonElement);
        const errorMessageElement = screen.getByText(validationErrorMessages.email.required);

        expect(errorMessageElement).toBeInTheDocument();

        await user.type(emailFieldElement, 'test');
        expect(errorMessageElement).not.toHaveTextContent(validationErrorMessages.email.required);
        expect(errorMessageElement).toHaveTextContent(validationErrorMessages.email.pattern);

        await user.type(emailFieldElement, '@test.com');
        expect(errorMessageElement).not.toBeInTheDocument();
      });

      it('should provide immediate password validation feedback as user types', async () => {
        const { withStoreComponent } = withStore(<LoginForm />);
        const user = userEvent.setup();

        render(withStoreComponent);
        const emailFieldElement = screen.getByLabelText(emailFieldLabel);
        const passwordFieldElement = screen.getByLabelText(passwordFieldLabel);
        const submitButtonElement = screen.getByRole('button', { name: submitButtonText });
        await user.type(emailFieldElement, 'test@test.com');
        await user.click(submitButtonElement);
        const errorMessageElement = screen.getByText(validationErrorMessages.password.required);

        expect(errorMessageElement).toBeInTheDocument();

        await user.type(passwordFieldElement, 'abc');
        expect(errorMessageElement).not.toHaveTextContent(validationErrorMessages.password.required);
        expect(errorMessageElement).toHaveTextContent(validationErrorMessages.password.pattern);

        await user.type(passwordFieldElement, '1');
        expect(errorMessageElement).not.toBeInTheDocument();
      });
    });
  });

  describe('form submitting with valid data', () => {
    const fillOutAndSubmitForm = async () => {
      const emailFieldElement = screen.getByLabelText(emailFieldLabel);
      const passwordFieldElement = screen.getByLabelText(passwordFieldLabel);
      const submitButtonElement = screen.getByRole('button', { name: submitButtonText });

      const user = userEvent.setup();
      await user.type(emailFieldElement, someValidEmail);
      await user.type(passwordFieldElement, someValidPassword);
      await user.click(submitButtonElement);

      return { emailFieldElement, passwordFieldElement };
    };

    it('should submit form successfully', async () => {
      const { withStoreComponent, store, mockAPIAdapter } = withStore(<LoginForm />);
      const mockUserData = getMockAuthUser();
      mockAPIAdapter.onPost(APIRoute.Login).reply(StatusCodes.CREATED, mockUserData);

      render(withStoreComponent);
      await fillOutAndSubmitForm();
      const errorMessageElement = screen.queryByTestId(errorMessageTestId);
      const dispatchedActionsTypes = extractActionsTypes(store.getActions());
      const sliceState = store.getState()[SliceName.User];

      expect(errorMessageElement).not.toBeInTheDocument();
      expect(dispatchedActionsTypes).toEqual(expect.arrayContaining([
        loginUser.pending.type,
        loginUser.fulfilled.type,
      ]));
      expect(sliceState).toEqual(expect.objectContaining({
        loggingInStatus: RequestStatus.Success,
      }));
    });

    it('should preserve user input and display error message when login request fails', async () => {
      const { withStoreComponent, store, mockAPIAdapter } = withStore(<LoginForm />);
      mockAPIAdapter.onPost(APIRoute.Login).reply(StatusCodes.BAD_REQUEST);

      render(withStoreComponent);
      await fillOutAndSubmitForm();
      const errorMessageElement = screen.getByTestId(errorMessageTestId);
      const dispatchedActionsTypes = extractActionsTypes(store.getActions());
      const sliceState = store.getState()[SliceName.User];

      expect(errorMessageElement).toHaveTextContent(ERROR_PLACEHOLDER_MESSAGE);
      expect(screen.getByDisplayValue(someValidEmail)).toBeInTheDocument();
      expect(screen.getByDisplayValue(someValidPassword)).toBeInTheDocument();
      expect(dispatchedActionsTypes).toEqual(expect.arrayContaining([
        loginUser.pending.type,
        loginUser.rejected.type,
      ]));
      expect(sliceState).toEqual(expect.objectContaining({
        loggingInStatus: RequestStatus.Error,
      }));
    });
  });

  describe('clearing login error data', () => {
    it('should clear login errors when user starts typing after failed submission', async () => {
      const { withStoreComponent, store, mockAPIAdapter } = withStore(<LoginForm />);
      mockAPIAdapter.onPost(APIRoute.Login).reply(StatusCodes.BAD_REQUEST);
      const user = userEvent.setup();

      render(withStoreComponent);
      const emailFieldElement = screen.getByLabelText(emailFieldLabel);
      const passwordFieldElement = screen.getByLabelText(passwordFieldLabel);
      const submitButtonElement = screen.getByRole('button', { name: submitButtonText });
      await user.type(emailFieldElement, someValidEmail);
      await user.type(passwordFieldElement, someValidPassword);
      await user.click(submitButtonElement);
      await user.type(passwordFieldElement, '4');
      const dispatchedActionsTypes = extractActionsTypes(store.getActions());

      expect(dispatchedActionsTypes).toEqual([
        userActions.clearLoginErrorData.type,
        loginUser.pending.type,
        loginUser.rejected.type,
        userActions.clearLoginErrorData.type,
      ]);
      const errorMessageElement = screen.queryByTestId(errorMessageTestId);
      expect(errorMessageElement).not.toBeInTheDocument();
    });

    it('should not dispatch clearLoginErrorData action when no login error data exist', async () => {
      const { withStoreComponent, store, mockAPIAdapter } = withStore(<LoginForm />);
      mockAPIAdapter.onPost(APIRoute.Login).reply(StatusCodes.BAD_REQUEST);
      const user = userEvent.setup();

      render(withStoreComponent);
      const fieldElement = screen.getByLabelText(emailFieldLabel);
      await user.type(fieldElement, 'test');
      await user.type(fieldElement, '123');
      const dispatchedActionsTypes = extractActionsTypes(store.getActions());

      expect(dispatchedActionsTypes).toEqual([
        userActions.clearLoginErrorData.type,
      ]);
    });
  });
});
