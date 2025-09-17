import { useParams } from 'react-router-dom';
import { PageTitle } from '../../const';
import { useAppDispatch, useFilm } from '../../hooks';
import { fetchFilm } from '../../store/async-actions';

import LoadingPage from '../loading-page';
import NotFoundPage from '../not-found-page';
import ErrorPage from '../error-page';
import FilmPageContent from '../../components/film-page-content';

function FilmPage(): JSX.Element {
  const filmId = useParams().id as string;
  const { data, isLoadFailed, isNotFound } = useFilm(filmId, true);

  const dispatch = useAppDispatch();

  if (data) {
    return <FilmPageContent film={data} />;
  }

  if (isLoadFailed) {
    return (isNotFound)
      ? <NotFoundPage />
      : (
        <ErrorPage
          title={PageTitle.Film}
          text="We couldn&apos;t load the film. Please try again later."
          onRetryButtonClick={() => {
            dispatch(fetchFilm(filmId));
          }}
        />
      );
  }

  return <LoadingPage />;
}

export default FilmPage;
