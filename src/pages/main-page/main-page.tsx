import Catalog from '../../components/catalog';
import PromoFilm from '../../components/promo-film';
import { Helmet } from 'react-helmet-async';
import SiteFooter from '../../components/site-footer';

function MainPage(): JSX.Element {
  return (
    <>
      <Helmet>
        <title>WTW</title>
      </Helmet>
      <PromoFilm />
      <div className="page-content">
        <Catalog />
        <SiteFooter />
      </div>
    </>
  );
}

export default MainPage;
