import { Helmet } from 'react-helmet-async';
import { favoritesSelectors } from '../../store/favorites/favorites.selectors';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { PageTitle } from '../../const';
import { fetchFavorites } from '../../store/async-actions';
import SiteHeader from '../../components/site-header';
import FilmsList from '../../components/films-list';
import SiteFooter from '../../components/site-footer';
import Spinner from '../../components/spinner';
import ErrorMessage from '../../components/error-message';

function MyListPage(): JSX.Element {
  const favorites = useAppSelector(favoritesSelectors.films);
  const isLoading = useAppSelector(favoritesSelectors.isLoading);
  const isLoaded = useAppSelector(favoritesSelectors.isLoaded);
  const isLoadFailed = useAppSelector(favoritesSelectors.isLoadFailed);

  const favoritesCount = favorites.length;
  const pageHeadingMarkup = `My list ${isLoaded ? `<span class="user-page__film-count">${favoritesCount}</span>` : ''}`.trim();

  const dispatch = useAppDispatch();

  return (
    <div className="user-page">
      <Helmet>
        <title>{PageTitle.MyList}</title>
      </Helmet>

      <SiteHeader className="user-page__head" heading={pageHeadingMarkup} withUserNavigation />

      <section className="catalog">
        <h2 className="catalog__title visually-hidden">Catalog</h2>

        {isLoading && <Spinner />}

        {isLoadFailed && (
          <ErrorMessage
            text="We couldn&apos;t load the favorites. Please try again later."
            onRetryButtonClick={() => {
              dispatch(fetchFavorites());
            }}
          />
        )}

        {isLoaded && !!favoritesCount && <FilmsList films={favorites} />}
      </section>

      <SiteFooter />
    </div>
  );
}

export default MyListPage;
