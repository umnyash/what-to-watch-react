import { useState, useEffect } from 'react';
import useAppDispatch from '../../hooks/use-app-dispatch';
import useAppSelector from '../../hooks/use-app-selector';
import { fetchPromoFilm, fetchFilms } from '../../store/async-actions';
import SiteHeader from '../../components/site-header';
import Logo from '../../components/logo';
import FilmHeader from '../../components/film-header';
import Spinner from '../../components/spinner';
import GenresList from '../../components/genres-list';
import FilmsList from '../../components/films-list';
import Button from '../../components/button';
import { Films, FilmsByGenre } from '../../types/films';
import { ALL_GENRES, FILMS_PER_LOAD } from '../../const';
import { Helmet } from 'react-helmet-async';

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

function MainPage(): JSX.Element {
  const [displayedFilmsMaxCount, setDisplayedFilmsMaxCount] = useState(FILMS_PER_LOAD);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchPromoFilm());
    dispatch(fetchFilms());
  }, [dispatch]);

  const promoFilm = useAppSelector((state) => state.promoFilm);
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
      <section className="film-card" style={{ backgroundColor: '#180202' }}>
        {promoFilm && (
          <div className="film-card__bg">
            <img src={promoFilm.backgroundImage} alt={promoFilm.name} />
          </div>
        )}

        <h1 className="visually-hidden">WTW</h1>
        <SiteHeader className="film-card__head" withUserNavigation />

        {promoFilm && (
          <div className="film-card__wrap">
            <div className="film-card__info">
              <div className="film-card__poster">
                <img src={promoFilm.posterImage} alt={`${promoFilm.name} poster`} width="218" height="327" />
              </div>

              <FilmHeader film={promoFilm} />
            </div>
          </div>
        )}
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
