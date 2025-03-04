import { Helmet } from 'react-helmet-async';
import { AppRoute } from '../../const';
import SiteHeader from '../../components/site-header';
import Button, { ButtonType, ButtonSize } from '../../components/button';
import SiteFooter from '../../components/site-footer';

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

      <SiteFooter />
    </div>
  );
}

export default NotFoundPage;
