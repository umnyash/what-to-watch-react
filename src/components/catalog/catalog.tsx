import { useState, useEffect } from 'react';
import useAppDispatch from '../../hooks/use-app-dispatch';
import useAppSelector from '../../hooks/use-app-selector';
import { catalogSelectors } from '../../store/catalog/catalog.selectors';
import { fetchFilms } from '../../store/async-actions';
import Spinner from '../spinner';
import GenresList from '../genres-list';
import FilmsList from '../films-list';
import Button from '../button';
import ErrorMessage from '../error-message';
import { Films, FilmsByGenre } from '../../types/films';
import { ALL_GENRES, FILMS_PER_LOAD } from '../../const';

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

function Catalog(): JSX.Element {
  const [displayedFilmsMaxCount, setDisplayedFilmsMaxCount] = useState(FILMS_PER_LOAD);

  const activeGenre = useAppSelector(catalogSelectors.genre);
  const films = useAppSelector(catalogSelectors.films);
  const isFilmsLoading = useAppSelector(catalogSelectors.isFilmsLoading);
  const isFilmsLoaded = useAppSelector(catalogSelectors.isFilmsLoaded);
  const isFilmsLoadFailed = useAppSelector(catalogSelectors.isFilmsLoadFailed);
  const filmsByGenre = groupFilmsByGenre(films);
  const filmsByActiveGenre = (activeGenre === ALL_GENRES) ? films : filmsByGenre[activeGenre];

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isFilmsLoaded) {
      return;
    }

    dispatch(fetchFilms());
  }, [isFilmsLoaded, dispatch]);

  const handleShowMoreButtonClick = () => {
    setDisplayedFilmsMaxCount((count) => count + FILMS_PER_LOAD);
  };

  const handleGenreClick = () => {
    setDisplayedFilmsMaxCount(FILMS_PER_LOAD);
  };

  return (
    <section className="catalog">
      <h2 className="catalog__title visually-hidden">Catalog</h2>

      {isFilmsLoading && <Spinner />}

      {isFilmsLoadFailed && (
        <ErrorMessage
          text="We couldn&apos;t load the films. Please try again later."
          onRetryButtonClick={() => {
            dispatch(fetchFilms());
          }}
        />
      )}

      {isFilmsLoaded && (
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
  );
}

export default Catalog;
