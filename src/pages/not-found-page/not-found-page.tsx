import { Helmet } from 'react-helmet-async';
import { AppRoute } from '../../const';
import SiteHeader from '../../components/site-header';
import Logo from '../../components/logo';
import Button from '../../components/button';
import { ButtonType, ButtonSize } from '../../types/button';

function NotFoundPage(): JSX.Element {
  return (
    <div className="user-page">
      <Helmet>
        <title>WTW: Page not found</title>
      </Helmet>

      <SiteHeader className="user-page__head" heading="404 Not Found" />

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
