import { useEffect } from 'react';
import useAppDispatch from '../../hooks/use-app-dispatch';
import useAppSelector from '../../hooks/use-app-selector';
import { similarFilmsSelectors } from '../../store/similar-films/similar-films.selectors';
import Films from '../films';
import { fetchSimilarFilms } from '../../store/async-actions';

type SimilarFilmsProps = {
  filmId: string;
}

function SimilarFilms({ filmId }: SimilarFilmsProps): JSX.Element {
  const currentFilmId = useAppSelector(similarFilmsSelectors.filmId);
  const similarFilms = useAppSelector(similarFilmsSelectors.someRandomFilms);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (currentFilmId === filmId) {
      return;
    }

    dispatch(fetchSimilarFilms(filmId));
  }, [filmId, currentFilmId, dispatch]);

  return <Films heading="More like this" films={similarFilms} />;
}

export default SimilarFilms;
