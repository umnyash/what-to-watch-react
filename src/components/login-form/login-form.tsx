import { useState, useRef, useEffect, ChangeEvent, FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { userActions } from '../../store/user/user.slice';
import { userSelectors } from '../../store/user/user.selectors';
import { loginUser } from '../../store/async-actions';
import Button, { ButtonType, ButtonSize } from '../button';
import TextField from '../text-field';
import { getValidationErrorMessage } from '../../validation';

enum FieldId {
  Email = 'user-email',
  Password = 'user-password',
}

function LoginForm(): JSX.Element {
  const emailInputElementRef = useRef<HTMLInputElement | null>(null);
  const passwordInputElementRef = useRef<HTMLInputElement | null>(null);
  const [activeFieldId, setActiveFieldId] = useState<FieldId | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const isLoggingIn = useAppSelector(userSelectors.isLoggingIn);
  const loginErrorMessage = useAppSelector(userSelectors.loginErrorMessage);
  const emailErrorMessage = getValidationErrorMessage('email', formData.email);
  const passwordErrorMessage = getValidationErrorMessage('password', formData.password);
  let errorMessage: string | null = null;

  switch (activeFieldId) {
    case FieldId.Email:
      errorMessage = emailErrorMessage;
      break;
    case FieldId.Password:
      errorMessage = passwordErrorMessage;
      break;
    default:
      errorMessage = loginErrorMessage;
  }

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(userActions.clearLoginErrorData());
  }, [dispatch]);

  const handleFieldChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));

    if (loginErrorMessage) {
      dispatch(userActions.clearLoginErrorData());
    }
  };

  const handleFieldBlur = () => {
    setActiveFieldId(null);
  };

  const handleFormSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    switch (true) {
      case Boolean(emailErrorMessage):
        emailInputElementRef.current?.focus();
        setActiveFieldId(FieldId.Email);
        break;
      case Boolean(passwordErrorMessage):
        passwordInputElementRef.current?.focus();
        setActiveFieldId(FieldId.Password);
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
          id={FieldId.Email}
          name="email"
          label="Email address"
          type="email"
          value={formData.email}
          placeholder="Email address"
          required
          invalid={activeFieldId === FieldId.Email && Boolean(emailErrorMessage)}
          disabled={isLoggingIn}
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
        />
        <TextField
          inputRef={passwordInputElementRef}
          id={FieldId.Password}
          name="password"
          label="Password"
          type="password"
          value={formData.password}
          pattern="(?=.*[a-zA-Z])(?=.*\d).*"
          title="Пароль должен состоять минимум из одной буквы и цифры."
          placeholder="Password"
          required
          invalid={activeFieldId === FieldId.Password && Boolean(passwordErrorMessage)}
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
