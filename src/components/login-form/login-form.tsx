import { useState, useRef, useEffect, ChangeEvent, FormEvent } from 'react';
import useAppDispatch from '../../hooks/use-app-dispatch';
import useAppSelector from '../../hooks/use-app-selector';
import { userActions } from '../../store/user/user.slice';
import { userSelectors } from '../../store/user/user.selectors';
import { loginUser } from '../../store/async-actions';
import Button, { ButtonType, ButtonSize } from '../button';
import TextField from '../text-field';
import { getValidationErrorMessage } from '../../validation';

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

  const isLoggingIn = useAppSelector(userSelectors.isLoggingIn);
  const loginErrorMessage = useAppSelector(userSelectors.loginErrorMessage);
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

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(userActions.clearLoginErrorData());
  }, [dispatch]);

  const handleFieldChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setFormData({ ...formData, [name]: value });
    dispatch(userActions.clearLoginErrorData());
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
        <TextField
          inputRef={emailInputElementRef}
          id={EMAIL_FIELD_ID}
          name="email"
          label="Email address"
          type="email"
          value={formData.email}
          placeholder="Email address"
          required
          invalid={activeFieldId === EMAIL_FIELD_ID && Boolean(emailErrorMessage)}
          disabled={isLoggingIn}
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
        />
        <TextField
          inputRef={passwordInputElementRef}
          id={PASSWORD_FIELD_ID}
          name="password"
          label="Password"
          type="password"
          value={formData.password}
          pattern="(?=.*[a-zA-Z])(?=.*\d).*"
          title="Пароль должен состоять минимум из одной буквы и цифры."
          placeholder="Password"
          required
          invalid={activeFieldId === PASSWORD_FIELD_ID && Boolean(passwordErrorMessage)}
          disabled={isLoggingIn}
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
        />
      </div>
      <div className="sign-in__submit">
        <Button type={ButtonType.Submit} size={ButtonSize.L} disabled={isLoggingIn}>Sign in</Button>
      </div>
    </form>
  );
}

export default LoginForm;
