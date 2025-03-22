import { useEffect } from 'react';
import { useLocation, Location, useParams } from 'react-router-dom';
import { LocationState } from '../../types/location';
import { AppRoute, ROUTE_PARAM_ID } from '../../const';
import { Helmet } from 'react-helmet-async';
import useAppSelector from '../../hooks/use-app-selector';
import { filmSelectors } from '../../store/film/film.selectors';
import { promoFilmSelectors } from '../../store/promo-film/promo-film.selectors';
import useAppDispatch from '../../hooks/use-app-dispatch';
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
  const filmPageLink = AppRoute.Film.replace(ROUTE_PARAM_ID, filmId);

  const film = useAppSelector(filmSelectors.film);
  const promoFilm = useAppSelector(promoFilmSelectors.film);
  const targetFilm = [film, promoFilm].find((item) => item?.id === filmId) ?? null;
  const isFilmLoading = useAppSelector(filmSelectors.isLoading);
  const isFilmLoadFailed = useAppSelector(filmSelectors.isLoadFailed);
  const isNotFound = useAppSelector(filmSelectors.isNotFound);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (targetFilm) {
      return;
    }

    dispatch(fetchFilm(filmId));
  }, [filmId, targetFilm, dispatch]);

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
        <title>WTW: Player</title>
      </Helmet>
      <PlayerWrapped film={targetFilm} previousPage={location.state?.from || filmPageLink} />
    </>
  );
}

export default PlayerPage;
