import { useEffect } from 'react';
import { Link, useLocation, Location, useParams } from 'react-router-dom';
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

  const { name, backgroundImage, videoLink } = targetFilm;

  return (
    <div className="player">
      <Helmet>
        <title>WTW: Player</title>
      </Helmet>
      <video src={videoLink} className="player__video" poster={backgroundImage} />

      <Link
        className="player__exit"
        to={location.state?.from || filmPageLink}
        style={{ textDecoration: 'none' }}
      >
        Exit
      </Link>

      <div className="player__controls">
        <div className="player__controls-row">
          <div className="player__time">
            <progress className="player__progress" value="30" max="100"></progress>
            <div className="player__toggler" style={{ left: '30%' }}>Toggler</div>
          </div>
          <div className="player__time-value">1:30:29</div>
        </div>

        <div className="player__controls-row">
          <button type="button" className="player__play">
            <svg viewBox="0 0 19 19" width="19" height="19">
              <use xlinkHref="#play-s" />
            </svg>
            <span>Play</span>
          </button>
          <div className="player__name">{name}</div>

          <button type="button" className="player__full-screen">
            <svg viewBox="0 0 27 27" width="27" height="27">
              <use xlinkHref="#full-screen" />
            </svg>
            <span>Full screen</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlayerPage;
