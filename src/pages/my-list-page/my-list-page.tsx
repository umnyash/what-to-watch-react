import { Helmet } from 'react-helmet-async';
import useAppSelector from '../../hooks/use-app-selector';
import { favoritesSelectors } from '../../store/favorites/favorites.selectors';
import SiteHeader from '../../components/site-header';
import FilmsList from '../../components/films-list';
import SiteFooter from '../../components/site-footer';

function MyListPage(): JSX.Element {
  const favorites = useAppSelector(favoritesSelectors.films);
  const favoritesCount = favorites.length;
  const pageHeadingMarkup = `My list <span class="user-page__film-count">${favoritesCount}</span>`;

  return (
    <div className="user-page">
      <Helmet>
        <title>WTW: My list</title>
      </Helmet>

      <SiteHeader className="user-page__head" heading={pageHeadingMarkup} withUserNavigation />

      <section className="catalog">
        <h2 className="catalog__title visually-hidden">Catalog</h2>
        {!!favoritesCount && <FilmsList films={favorites} />}
      </section>

      <SiteFooter />
    </div>
  );
}

export default MyListPage;
