import { useState, useRef, useEffect, ChangeEvent, FormEvent } from 'react';
import useAppDispatch from '../../hooks/use-app-dispatch';
import useAppSelector from '../../hooks/use-app-selector';
import { selectors } from '../../store/selectors';
import { clearLoginErrorData } from '../../store/actions';
import { loginUser } from '../../store/async-actions';
import Button, { ButtonType, ButtonSize } from '../button';
import { getValidationErrorMessage } from '../../validation';
import clsx from 'clsx';

const EMAIL_FIELD_ID = 'user-email';
const PASSWORD_FIELD_ID = 'user-password';

function LoginForm(): JSX.Element {
  const emailInputElementRef = useRef<HTMLInputElement | null>(null);
  const passwordInputElementRef = useRef<HTMLInputElement | null>(null);
  const [activeFieldId, setActiveFieldId] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const isLoggingIn = useAppSelector(selectors.isLoggingIn);
  const loginErrorMessage = useAppSelector(selectors.loginErrorMessage);
  const emailErrorMessage = getValidationErrorMessage('email', formData.email);
  const passwordErrorMessage = getValidationErrorMessage('password', formData.password);
  let errorMessage: string | null = null;

  if (loginErrorMessage) {
    errorMessage = loginErrorMessage;
  } else {
    switch (activeFieldId) {
      case EMAIL_FIELD_ID:
        errorMessage = emailErrorMessage;
        break;
      case PASSWORD_FIELD_ID:
        errorMessage = passwordErrorMessage;
        break;
    }
  }

  const emailFieldClassName = clsx(
    'sign-in__field',
    activeFieldId === EMAIL_FIELD_ID &&
    emailErrorMessage &&
    'sign-in__field--error'
  );

  const passwordFieldClassName = clsx(
    'sign-in__field',
    activeFieldId === PASSWORD_FIELD_ID &&
    passwordErrorMessage &&
    'sign-in__field--error'
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(clearLoginErrorData());
  }, [dispatch]);

  const handleFieldChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setFormData({ ...formData, [name]: value });
    dispatch(clearLoginErrorData());
  };

  const handleFieldBlur = () => {
    setActiveFieldId('');
  };

  const handleFormSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    switch (true) {
      case Boolean(emailErrorMessage):
        emailInputElementRef.current?.focus();
        setActiveFieldId(EMAIL_FIELD_ID);
        break;
      case Boolean(passwordErrorMessage):
        passwordInputElementRef.current?.focus();
        setActiveFieldId(PASSWORD_FIELD_ID);
        break;
      default:
        dispatch(loginUser(formData));
    }
  };

  return (
    <form className="sign-in__form" method="post" action="#" noValidate onSubmit={handleFormSubmit}>
      {errorMessage && (
        <div className="sign-in__message">
          <p>{errorMessage}</p>
        </div>
      )}
      <div className="sign-in__fields">
        <div className={emailFieldClassName}>
          <input
            ref={emailInputElementRef}
            className="sign-in__input"
            id={EMAIL_FIELD_ID}
            type="email"
            name="email"
            value={formData.email}
            placeholder="Email address"
            required
            disabled={isLoggingIn}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
          />
          <label className="sign-in__label visually-hidden" htmlFor="user-email">Email address</label>
        </div>
        <div className={passwordFieldClassName}>
          <input
            ref={passwordInputElementRef}
            className="sign-in__input"
            id={PASSWORD_FIELD_ID}
            type="password"
            name="password"
            value={formData.password}
            placeholder="Password"
            required
            disabled={isLoggingIn}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            pattern="(?=.*[a-zA-Z])(?=.*\d).*"
            title="Пароль должен состоять минимум из одной буквы и цифры."
          />
          <label className="sign-in__label visually-hidden" htmlFor="user-password">Password</label>
        </div>
      </div>
      <div className="sign-in__submit">
        <Button type={ButtonType.Submit} size={ButtonSize.L} disabled={isLoggingIn}>Sign in</Button>
      </div>
    </form>
  );
}

export default LoginForm;
