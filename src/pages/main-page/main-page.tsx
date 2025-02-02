import { useState, useEffect } from 'react';
import useAppDispatch from '../../hooks/use-app-dispatch';
import useAppSelector from '../../hooks/use-app-selector';
import { fetchFilms } from '../../store/async-actions';
import { PromoFilm } from '../../types/promo-film';
import Logo from '../../components/logo';
import UserNavigation from '../../components/user-navigation';
import Spinner from '../../components/spinner';
import GenresList from '../../components/genres-list';
import FilmsList from '../../components/films-list';
import Button from '../../components/button';
import { Films, FilmsByGenre } from '../../types/films';
import { ALL_GENRES, FILMS_PER_LOAD } from '../../const';
import { Helmet } from 'react-helmet-async';

type MainPageProps = {
  promoFilm: PromoFilm;
}

function groupFilmsByGenre(films: Films) {
  return films.reduce((genreMap: FilmsByGenre, film) => {
    const genre = film.genre;

    if (!genreMap[genre]) {
      genreMap[genre] = [];
    }

    genreMap[genre].push(film);
    return genreMap;
  }, {});
}

function MainPage({ promoFilm }: MainPageProps): JSX.Element {
  const [displayedFilmsMaxCount, setDisplayedFilmsMaxCount] = useState(FILMS_PER_LOAD);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchFilms());
  }, [dispatch]);

  const activeGenre = useAppSelector((state) => state.genre);
  const films = useAppSelector((state) => state.films);
  const isFilmsLoading = useAppSelector((state) => state.isFilmsLoading);
  const filmsByGenre = groupFilmsByGenre(films);
  const filmsByActiveGenre = (activeGenre === ALL_GENRES) ? films : filmsByGenre[activeGenre];

  const handleShowMoreButtonClick = () => {
    setDisplayedFilmsMaxCount((count) => count + FILMS_PER_LOAD);
  };

  const handleGenreClick = () => {
    setDisplayedFilmsMaxCount(FILMS_PER_LOAD);
  };

  return (
    <>
      <Helmet>
        <title>WTW</title>
      </Helmet>
      <section className="film-card">
        <div className="film-card__bg">
          <img src="img/bg-the-grand-budapest-hotel.jpg" alt="The Grand Budapest Hotel" />
        </div>

        <h1 className="visually-hidden">WTW</h1>

        <header className="page-header film-card__head">
          <Logo />

          <UserNavigation />
        </header>

        <div className="film-card__wrap">
          <div className="film-card__info">
            <div className="film-card__poster">
              <img src="img/the-grand-budapest-hotel-poster.jpg" alt="The Grand Budapest Hotel poster" width="218" height="327" />
            </div>

            <div className="film-card__desc">
              <h2 className="film-card__title">{promoFilm.name}</h2>
              <p className="film-card__meta">
                <span className="film-card__genre">{promoFilm.genre}</span>
                <span className="film-card__year">{promoFilm.released}</span>
              </p>

              <div className="film-card__buttons">
                <button className="btn btn--play film-card__button" type="button">
                  <svg viewBox="0 0 19 19" width="19" height="19">
                    <use xlinkHref="#play-s" />
                  </svg>
                  <span>Play</span>
                </button>
                <button className="btn btn--list film-card__button" type="button">
                  <svg viewBox="0 0 19 20" width="19" height="20">
                    <use xlinkHref="#add" />
                  </svg>
                  <span>My list</span>
                  <span className="film-card__count">9</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="page-content">
        <section className="catalog">
          <h2 className="catalog__title visually-hidden">Catalog</h2>

          {isFilmsLoading && <Spinner />}

          {!isFilmsLoading && (
            <>
              <GenresList activeGenre={activeGenre} filmsByGenre={filmsByGenre} onGenreClick={handleGenreClick} />
              <FilmsList films={filmsByActiveGenre.slice(0, displayedFilmsMaxCount)} />

              {filmsByActiveGenre.length > displayedFilmsMaxCount && (
                <div className="catalog__more">
                  <Button onClick={handleShowMoreButtonClick}>Show more</Button>
                </div>
              )}
            </>
          )}
        </section>

        <footer className="page-footer">
          <Logo isLight />

          <div className="copyright">
            <p>© 2019 What to watch Ltd.</p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default MainPage;
