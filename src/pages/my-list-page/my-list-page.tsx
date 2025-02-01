import { Helmet } from 'react-helmet-async';
import { Films } from '../../types/films';
import Logo from '../../components/logo';
import UserNavigation from '../../components/user-navigation';
import FilmsList from '../../components/films-list';

type MyListPageProps = {
  films: Films;
}

function MyListPage({ films }: MyListPageProps): JSX.Element {
  return (
    <div className="user-page">
      <Helmet>
        <title>WTW: My list</title>
      </Helmet>
      <header className="page-header user-page__head">
        <Logo />

        <h1 className="page-title user-page__title">My list <span className="user-page__film-count">9</span></h1>
        <UserNavigation />
      </header>

      <section className="catalog">
        <h2 className="catalog__title visually-hidden">Catalog</h2>
        <FilmsList films={films} />
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
