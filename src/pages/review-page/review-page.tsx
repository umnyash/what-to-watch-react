import { useParams } from 'react-router-dom';
import { useAppDispatch, useFilm } from '../../hooks';
import { fetchFilm } from '../../store/async-actions';
import { PageTitle } from '../../const';

import LoadingPage from '../loading-page';
import NotFoundPage from '../not-found-page';
import ErrorPage from '../error-page';
import ReviewPageContent from '../../components/review-page-content';

function ReviewPage(): JSX.Element {
  const filmId = useParams().id as string;
  const dispatch = useAppDispatch();

  const { data, isLoadFailed, isNotFound } = useFilm(filmId);

  if (data) {
    return <ReviewPageContent film={data} />;
  }

  if (isLoadFailed) {
    return isNotFound
      ? <NotFoundPage />
      : (
        <ErrorPage
          title={PageTitle.Review}
          text="We couldn&apos;t load the film. Please try again later."
          onRetryButtonClick={() => {
            dispatch(fetchFilm(filmId));
          }}
        />
      );
  }

  return <LoadingPage />;
}

export default ReviewPage;
