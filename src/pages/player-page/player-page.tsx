import { useEffect } from 'react';
import { useLocation, Location, useParams, generatePath } from 'react-router-dom';
import { LocationState } from '../../types/location';
import { AppRoute, PageTitle } from '../../const';
import { Helmet } from 'react-helmet-async';
import { filmSelectors } from '../../store/film/film.selectors';
import { promoFilmSelectors } from '../../store/promo-film/promo-film.selectors';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchFilm } from '../../store/async-actions';

import LoadingPage from '../loading-page';
import NotFoundPage from '../not-found-page';
import ErrorPage from '../error-page';
import Player from '../../components/player';
import withVideo from '../../hocs/with-video/with-video';

const PlayerWrapped = withVideo(Player);

function PlayerPage(): JSX.Element {
  const location = useLocation() as Location<LocationState>;
  const filmId = useParams().id as string;
  const filmPageLink = generatePath(AppRoute.Film, { id: filmId });

  const film = useAppSelector(filmSelectors.film);
  const promoFilm = useAppSelector(promoFilmSelectors.film);
  const targetFilm = [film, promoFilm].find((item) => item?.id === filmId) ?? null;
  const loadingFilmId = useAppSelector(filmSelectors.id);
  const isFilmLoading = useAppSelector(filmSelectors.isLoading);
  const isFilmLoadFailed = useAppSelector(filmSelectors.isLoadFailed);
  const isNotFound = useAppSelector(filmSelectors.isNotFound);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (targetFilm || (loadingFilmId === filmId && isFilmLoading)) {
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

  if (isFilmLoading) {
    return <LoadingPage />;
  }

  if (isFilmLoadFailed || !targetFilm) {
    return isNotFound
      ? <NotFoundPage />
      : (
        <ErrorPage
          text="We couldn&apos;t load the film. Please try again later."
          onRetryButtonClick={() => {
            dispatch(fetchFilm(filmId));
          }}
        />
      );
  }

  return (
    <>
      <Helmet>
        <title>{PageTitle.Player}</title>
      </Helmet>
      <PlayerWrapped film={targetFilm} previousPage={location.state?.from || filmPageLink} />
    </>
  );
}

export default PlayerPage;
