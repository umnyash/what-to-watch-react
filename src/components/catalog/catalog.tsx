import { useEffect } from 'react';
import useAppDispatch from '../../hooks/use-app-dispatch';
import useAppSelector from '../../hooks/use-app-selector';
import { catalogSelectors } from '../../store/catalog/catalog.selectors';
import { catalogActions } from '../../store/catalog/catalog.slice';
import { fetchFilms } from '../../store/async-actions';
import Spinner from '../spinner';
import GenresList from '../genres-list';
import FilmsList from '../films-list';
import Button from '../button';
import ErrorMessage from '../error-message';

function Catalog(): JSX.Element {
  const displayedFilmsMaxCount = useAppSelector(catalogSelectors.displayedFilmsMaxCount);
  const isFilmsLoading = useAppSelector(catalogSelectors.isFilmsLoading);
  const isFilmsLoaded = useAppSelector(catalogSelectors.isFilmsLoaded);
  const isFilmsLoadFailed = useAppSelector(catalogSelectors.isFilmsLoadFailed);
  const filmsByActiveGenre = useAppSelector(catalogSelectors.filmsByActiveGenre);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isFilmsLoaded) {
      return;
    }

    dispatch(fetchFilms());
  }, [isFilmsLoaded, dispatch]);

  useEffect(() => {
    dispatch(catalogActions.resetDisplayedFilmsMaxCount());
  }, [dispatch]);

  const handleShowMoreButtonClick = () => {
    dispatch(catalogActions.increaseDisplayedFilmsMaxCount());
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
          <GenresList />
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
