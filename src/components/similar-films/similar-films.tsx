import { useAppDispatch, useSimilarFilms } from '../../hooks';
import Spinner from '../spinner';
import ErrorMessage from '../error-message';
import Films from '../films';
import { fetchSimilarFilms } from '../../store/async-actions';

type SimilarFilmsProps = {
  filmId: string;
}

function SimilarFilms({ filmId }: SimilarFilmsProps): JSX.Element {
  const { data, isLoaded, isLoadFailed } = useSimilarFilms(filmId);
  const dispatch = useAppDispatch();

  if (isLoaded) {
    return <Films heading="More like this" films={data} />;
  }

  if (isLoadFailed) {
    return (
      <ErrorMessage
        text="We couldn&apos;t load the similar films. Please try again later."
        onRetryButtonClick={() => {
          dispatch(fetchSimilarFilms(filmId));
        }}
      />
    );
  }

  return <Spinner />;
}

export default SimilarFilms;
