import { Helmet } from 'react-helmet-async';
import { AppRoute } from '../../const';
import Logo from '../../components/logo';
import Button from '../../components/button';
import { ButtonType, ButtonSize } from '../../types/button';

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
        <Button type={ButtonType.Route} size={ButtonSize.L} to={AppRoute.Root}>Go to Homepage</Button>
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
