import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import useAppDispatch from '../../hooks/use-app-dispatch';
import useAppSelector from '../../hooks/use-app-selector';
import { selectors } from '../../store/selectors';
import { clearLoginErrorData } from '../../store/actions';
import { loginUser } from '../../store/async-actions';
import Button, { ButtonType, ButtonSize } from '../button';

function LoginForm(): JSX.Element {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const isLoggingIn = useAppSelector(selectors.isLoggingIn);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(clearLoginErrorData());
  }, [dispatch]);

  const handleFieldChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setFormData({ ...formData, [name]: value });
    dispatch(clearLoginErrorData());
  };

  const handleFormSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    dispatch(loginUser(formData));
  };

  return (
    <form className="sign-in__form" method="post" action="#" noValidate onSubmit={handleFormSubmit}>
      <div className="sign-in__fields">
        <div className="sign-in__field">
          <input
            className="sign-in__input"
            id="user-email"
            type="email"
            name="email"
            value={formData.email}
            placeholder="Email address"
            required
            disabled={isLoggingIn}
            onChange={handleFieldChange}
          />
          <label className="sign-in__label visually-hidden" htmlFor="user-email">Email address</label>
        </div>
        <div className="sign-in__field">
          <input
            className="sign-in__input"
            id="user-password"
            type="password"
            name="password"
            value={formData.password}
            placeholder="Password"
            required
            disabled={isLoggingIn}
            onChange={handleFieldChange}
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
