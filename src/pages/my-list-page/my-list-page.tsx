import { Helmet } from 'react-helmet-async';
import useAppSelector from '../../hooks/use-app-selector';
import Logo from '../../components/logo';
import UserNavigation from '../../components/user-navigation';
import FilmsList from '../../components/films-list';

function MyListPage(): JSX.Element {
  const favorites = useAppSelector((state) => state.favorites);
  const favoritesCount = favorites.length;

  return (
    <div className="user-page">
      <Helmet>
        <title>WTW: My list</title>
      </Helmet>
      <header className="page-header user-page__head">
        <Logo />

        <h1 className="page-title user-page__title">My list <span className="user-page__film-count">{favoritesCount}</span></h1>
        <UserNavigation />
      </header>

      <section className="catalog">
        <h2 className="catalog__title visually-hidden">Catalog</h2>
        {!!favoritesCount && <FilmsList films={favorites} />}
      </section>

      <footer className="page-footer">
        <Logo isLight />

        <div className="copyright">
          <p>© 2019 What to watch Ltd.</p>
        </div>
      </footer>
    </div>
  );
}

export default MyListPage;
