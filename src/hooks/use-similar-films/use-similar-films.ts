import { useEffect } from 'react';
import { Films } from '../../types/films';
import { useAppDispatch } from '../use-app-dispatch/use-app-dispatch';
import { useAppSelector } from '../use-app-selector/use-app-selector';
import { similarFilmsSelectors } from '../../store/similar-films/similar-films.selectors';
import { fetchSimilarFilms } from '../../store/async-actions';

type Result = {
  data: Films;
  isLoading: boolean;
  isLoaded: boolean;
  isLoadFailed: boolean;
}

export const useSimilarFilms = (id: string): Result => {
  const relatedFilmId = useAppSelector(similarFilmsSelectors.filmId);
  const data = useAppSelector(similarFilmsSelectors.someRandomFilms);
  const isLoading = useAppSelector(similarFilmsSelectors.isLoading);
  const isLoaded = useAppSelector(similarFilmsSelectors.isLoaded);
  const isLoadFailed = useAppSelector(similarFilmsSelectors.isLoadFailed);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id === relatedFilmId && (isLoading || isLoaded)) {
      return;
    }

    dispatch(fetchSimilarFilms(id));

    // The effect loads similar films data on mount or when filmId changes.
    // If the films are already loading or loaded, no new request is sent.
    //
    // Excluded from dependencies on purpose:
    // • relatedFilmId, isLoaded — would trigger an extra run when no request is needed (the condition above prevents it).
    // • isLoading — could cause an infinite loop of requests on loading error.
    //
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, dispatch]);

  if (id === relatedFilmId) {
    return {
      data,
      isLoading,
      isLoaded,
      isLoadFailed,
    };
  }

  return {
    data: [],
    isLoading: false,
    isLoaded: false,
    isLoadFailed: false,
  };
};
