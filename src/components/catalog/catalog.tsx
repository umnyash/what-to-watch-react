import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
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

  useEffect(() => {
    if (isFilmsLoaded || isFilmsLoading) {
      return;
    }

    dispatch(fetchFilms());

    // The effect loads films data only on mount.
    // If the films are already loading or loaded, no new request is sent.
    //
    // Excluded from dependencies on purpose:
    // • isFilmsLoaded — would trigger an extra run when no request is needed (the condition above prevents it).
    // • isFilmsLoading — could cause an infinite loop of requests on loading error.
    //
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

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
