import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PageTitle } from '../../const';
import { filmSelectors } from '../../store/film/film.selectors';
import { promoFilmSelectors } from '../../store/promo-film/promo-film.selectors';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchFilm } from '../../store/async-actions';

import LoadingPage from '../loading-page';
import NotFoundPage from '../not-found-page';
import ErrorPage from '../error-page';
import PlayerPageContent from '../../components/player-page-content';

function PlayerPage(): JSX.Element {
  const filmId = useParams().id as string;

  const film = useAppSelector(filmSelectors.film);
  const promoFilm = useAppSelector(promoFilmSelectors.film);
  const targetFilm = [film, promoFilm].find((item) => item?.id === filmId) ?? null;
  const requestedFilmId = useAppSelector(filmSelectors.id);
  const isFilmLoading = useAppSelector(filmSelectors.isLoading);
  const isFilmLoadFailed = useAppSelector(filmSelectors.isLoadFailed);
  const isNotFound = useAppSelector(filmSelectors.isNotFound);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (targetFilm || (requestedFilmId === filmId && isFilmLoading)) {
      return;
    }

    dispatch(fetchFilm(filmId));

    // The effect loads film data only on mount.
    // If the film is already loading or loaded, no new request is sent.
    //
    // Excluded from dependencies on purpose:
    // • targetFilm, loadingFilmId — would trigger an extra run when no request is needed (the condition above prevents it).
    // • isFilmLoading — could cause an infinite loop of requests on loading error.
    //
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filmId, dispatch]);

  if (targetFilm) {
    return <PlayerPageContent film={targetFilm} />;
  }

  if (requestedFilmId === filmId && isFilmLoadFailed) {
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
