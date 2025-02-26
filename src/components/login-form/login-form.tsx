import { useState, ChangeEvent, FormEvent } from 'react';
import useAppDispatch from '../../hooks/use-app-dispatch';
import { loginUser } from '../../store/async-actions';
import Button from '../button';
import { ButtonType, ButtonSize } from '../../types/button';

function LoginForm(): JSX.Element {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const dispatch = useAppDispatch();

  const handleFieldChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    dispatch(loginUser(formData));
  };

  return (
    <form className="sign-in__form" method="post" action="#" onSubmit={handleFormSubmit}>
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
            onChange={handleFieldChange}
            pattern="(?=.*[a-zA-Z])(?=.*\d).*"
            title="Пароль должен состоять минимум из одной буквы и цифры."
          />
          <label className="sign-in__label visually-hidden" htmlFor="user-password">Password</label>
        </div>
      </div>
      <div className="sign-in__submit">
        <Button type={ButtonType.Submit} size={ButtonSize.L}>Sign in</Button>
      </div>
    </form>
  );
}

export default LoginForm;
