import { Helmet } from 'react-helmet-async';
import Logo from '../../components/logo';
import SiteHeader from '../../components/site-header';
import LoginForm from '../../components/login-form';

function LoginPage(): JSX.Element {
  return (
    <div className="user-page">
      <Helmet>
        <title>WTW: Sign in</title>
      </Helmet>

      <SiteHeader className="user-page__head" heading="Sign in" />

      <div className="sign-in user-page__content">
        <LoginForm />
      </div>

      <footer className="page-footer">
        <Logo isLight />

        <div className="copyright">
          <p>© 2019 What to watch Ltd.</p>
        </div>
      </footer>
    </div>
  );
}

export default LoginPage;
