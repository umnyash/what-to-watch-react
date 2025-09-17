import { useParams } from 'react-router-dom';
import { PageTitle } from '../../const';
import { useAppDispatch, useFilm } from '../../hooks';
import { fetchFilm } from '../../store/async-actions';

import LoadingPage from '../loading-page';
import NotFoundPage from '../not-found-page';
import ErrorPage from '../error-page';
import PlayerPageContent from '../../components/player-page-content';

function PlayerPage(): JSX.Element {
  const filmId = useParams().id as string;
  const dispatch = useAppDispatch();

  const { data, isLoadFailed, isNotFound } = useFilm(filmId);

  if (data) {
    return <PlayerPageContent film={data} />;
  }

  if (isLoadFailed) {
    return isNotFound
      ? <NotFoundPage />
      : (
        <ErrorPage
          title={PageTitle.Player}
          text="We couldn&apos;t load the film. Please try again later."
          onRetryButtonClick={() => {
            dispatch(fetchFilm(filmId));
          }}
        />
      );
  }

  return <LoadingPage />;
}

export default PlayerPage;
