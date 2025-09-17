import { useEffect } from 'react';
import { useAppDispatch } from '../use-app-dispatch/use-app-dispatch';
import { useAppSelector } from '../use-app-selector/use-app-selector';
import { catalogSelectors } from '../../store/catalog/catalog.selectors';
import { fetchFilms } from '../../store/async-actions';

export const useLoadFilms = (): void => {
  const isLoading = useAppSelector(catalogSelectors.isFilmsLoading);
  const isLoaded = useAppSelector(catalogSelectors.isFilmsLoaded);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isLoaded || isLoading) {
      return;
    }

    dispatch(fetchFilms());

    // The effect loads films data only on mount.
    // If the films are already loading or loaded, no new request is sent.
    //
    // Excluded from dependencies on purpose:
    // • isLoaded — would trigger an extra run when no request is needed (the condition above prevents it).
    // • isLoading — could cause an infinite loop of requests on loading error.
    //
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
};
