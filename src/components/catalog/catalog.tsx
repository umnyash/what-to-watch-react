import { useEffect } from 'react';
import { useAppDispatch, useAppSelector, useLoadFilms } from '../../hooks';
import { catalogSelectors } from '../../store/catalog/catalog.selectors';
import { catalogActions } from '../../store/catalog/catalog.slice';
import { fetchFilms } from '../../store/async-actions';
import Spinner from '../spinner';
import ErrorMessage from '../error-message';
import CatalogContent from '../catalog-content';

function Catalog(): JSX.Element {
  const isFilmsLoading = useAppSelector(catalogSelectors.isFilmsLoading);
  const isFilmsLoaded = useAppSelector(catalogSelectors.isFilmsLoaded);
  const isFilmsLoadFailed = useAppSelector(catalogSelectors.isFilmsLoadFailed);
  const dispatch = useAppDispatch();

  useLoadFilms();

  useEffect(() => {
    dispatch(catalogActions.resetDisplayedFilmsMaxCount());
  }, [dispatch]);

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

      {isFilmsLoaded && <CatalogContent />}
    </section>
  );
}

export default Catalog;
