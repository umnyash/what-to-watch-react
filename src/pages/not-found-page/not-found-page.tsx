import { Helmet } from 'react-helmet-async';
import Logo from '../../components/logo';

function NotFoundPage(): JSX.Element {
  return (
    <div className="user-page">
      <Helmet>
        <title>WTW: Page not found</title>
      </Helmet>
      <header className="page-header user-page__head">
        <Logo />

        <h1 className="page-title user-page__title">404 Not Found</h1>
      </header>

      <div className="sign-in user-page__content">
        <a className="sign-in__btn" href="main.html" style={{ textDecoration: 'none' }}>Go to Homepage</a>
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

export default NotFoundPage;
