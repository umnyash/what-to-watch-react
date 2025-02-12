import { Helmet } from 'react-helmet-async';
import SiteHeader from '../../components/site-header';
import LoginForm from '../../components/login-form';
import SiteFooter from '../../components/site-footer';

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

      <SiteFooter />
    </div>
  );
}

export default LoginPage;
