import { ChangeEvent } from 'react';
import { screen, render, act } from '@testing-library/react';

import { ERROR_PLACEHOLDER_MESSAGE } from '../../const';
import { withStore } from '../../tests/render-helpers';
import { userSelectors } from '../../store/user/user.selectors';
import TextField from '../text-field';
import Button, { ButtonType, ButtonSize } from '../button';

import LoginForm from './login-form';

vi.mock('../../store/user/user.selectors', () => ({
  userSelectors: {
    isLoggingIn: vi.fn(() => false),
    loginErrorMessage: vi.fn(() => null),
  }
}));

vi.mock('../text-field', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../button', async () => {
  const originalModule = await vi.importActual('../button');

  return {
    ...originalModule,
    default: vi.fn(() => null)
  };
});

const createMockTextFieldChangeEvent = (name: string, value: string) => ({ target: { name, value } });

describe('Component: LoginForm', () => {
  const { withStoreComponent } = withStore(<LoginForm />);
  const mockedSelectors = vi.mocked(userSelectors);

  beforeEach(() => vi.clearAllMocks());

  it('should render form fields and submit button with correct props', () => {
    render(withStoreComponent);

    expect(TextField).toHaveBeenCalledTimes(2);
    expect(TextField).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        id: 'user-email',
        name: 'email',
        label: 'Email address',
        type: 'email',
        value: '',
        placeholder: 'Email address',
        required: true,
        disabled: false,
      }),
      expect.anything()
    );
    expect(TextField).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        id: 'user-password',
        name: 'password',
        label: 'Password',
        type: 'password',
        value: '',
        pattern: '(?=.*[a-zA-Z])(?=.*\\d).*',
        title: 'Пароль должен состоять минимум из одной буквы и цифры.',
        placeholder: 'Password',
        required: true,
        disabled: false,
      }),
      expect.anything()
    );
    expect(Button).toHaveBeenCalledOnce();
    expect(Button).toHaveBeenCalledWith(
      {
        type: ButtonType.Submit,
        size: ButtonSize.L,
        disabled: false,
        children: 'Sign in',
      },
      expect.anything()
    );
  });

  it('should update text fields values when user types', () => {
    const mockEmail = 'test@test.com';
    const mockPassword = 'abc123';
    const mockEmailChangeEvent = createMockTextFieldChangeEvent('email', mockEmail);
    const mockPasswordChangeEvent = createMockTextFieldChangeEvent('password', mockPassword);

    render(withStoreComponent);
    const emailFieldProps = vi.mocked(TextField).mock.calls[0][0];
    const passwordFieldProps = vi.mocked(TextField).mock.calls[1][0];
    act(() => {
      emailFieldProps.onChange(mockEmailChangeEvent as unknown as ChangeEvent<HTMLInputElement>);
      passwordFieldProps.onChange(mockPasswordChangeEvent as unknown as ChangeEvent<HTMLInputElement>);
    });

    expect(TextField).toHaveBeenCalledTimes(4);
    expect(TextField).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        name: 'email',
        value: mockEmail
      }),
      expect.anything()
    );
    expect(TextField).toHaveBeenNthCalledWith(
      4,
      expect.objectContaining({
        name: 'password',
        value: mockPassword
      }),
      expect.anything()
    );
  });

  it.each([
    ['enable', false],
    ['disable', true],
  ])('should %s all form fields and submit button when isLoggingIn selector returns %s', (_, isLoggingIn) => {
    mockedSelectors.isLoggingIn.mockReturnValue(isLoggingIn);

    render(withStoreComponent);

    expect(TextField).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        disabled: isLoggingIn,
      }),
      expect.anything()
    );
    expect(TextField).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        disabled: isLoggingIn,
      }),
      expect.anything()
    );
    expect(Button).toHaveBeenCalledWith(
      expect.objectContaining({
        disabled: isLoggingIn,
      }),
      expect.anything()
    );
  });

  it('should display login error when loginErrorMessage selector returns message', () => {
    mockedSelectors.loginErrorMessage.mockReturnValue(ERROR_PLACEHOLDER_MESSAGE);
    render(withStoreComponent);
    expect(screen.getByText(ERROR_PLACEHOLDER_MESSAGE)).toBeInTheDocument();
  });
});
