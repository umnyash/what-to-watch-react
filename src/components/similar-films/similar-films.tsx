import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { similarFilmsSelectors } from '../../store/similar-films/similar-films.selectors';
import Films from '../films';
import { fetchSimilarFilms } from '../../store/async-actions';

type SimilarFilmsProps = {
  filmId: string;
}

function SimilarFilms({ filmId }: SimilarFilmsProps): JSX.Element {
  const currentFilmId = useAppSelector(similarFilmsSelectors.filmId);
  const similarFilms = useAppSelector(similarFilmsSelectors.someRandomFilms);
  const isLoading = useAppSelector(similarFilmsSelectors.isLoading);
  const isLoaded = useAppSelector(similarFilmsSelectors.isLoaded);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (currentFilmId === filmId && (isLoading || isLoaded)) {
      return;
    }

    dispatch(fetchSimilarFilms(filmId));

    // The effect loads similar films data on mount or when filmId changes.
    // If the films are already loading or loaded, no new request is sent.
    //
    // Excluded from dependencies on purpose:
    // • currentFilmId, isLoaded — would trigger an extra run when no request is needed (the condition above prevents it).
    // • isLoading — could cause an infinite loop of requests on loading error.
    //
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filmId, dispatch]);

  return <Films heading="More like this" films={similarFilms} />;
}

export default SimilarFilms;
