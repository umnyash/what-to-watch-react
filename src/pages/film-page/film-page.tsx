import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PageTitle } from '../../const';
import { FilmSections, FILM_TABER_ACTIVE_TAB_SEARCH_PARAM } from './const';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { filmSelectors } from '../../store/film/film.selectors';
import { fetchFilm } from '../../store/async-actions';

import LoadingPage from '../loading-page';
import NotFoundPage from '../not-found-page';
import SiteHeader from '../../components/site-header';
import FilmHeader from '../../components/film-header';
import FilmTaber, { Tabs } from '../../components/film-taber';
import FilmOverview from '../../components/film-overview';
import FilmDetails from '../../components/film-details';
import Reviews from '../../components/reviews';
import SimilarFilms from '../../components/similar-films';
import SiteFooter from '../../components/site-footer';
import ErrorPage from '../error-page';

function FilmPage(): JSX.Element {
  const filmId = useParams().id as string;

  const currentFilmId = useAppSelector(filmSelectors.id);
  const film = useAppSelector(filmSelectors.film);
  const isFilmLoading = useAppSelector(filmSelectors.isLoading);
  const isFilmLoaded = useAppSelector(filmSelectors.isLoaded);
  const isFilmLoadFailed = useAppSelector(filmSelectors.isLoadFailed);
  const isNotFound = useAppSelector(filmSelectors.isNotFound);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (currentFilmId === filmId && (isFilmLoading || isFilmLoaded)) {
      return;
    }

    dispatch(fetchFilm(filmId));

    // The effect loads film data on mount or when filmId changes.
    // If the film is already loading or loaded, no new request is sent.
    //
    // Excluded from dependencies on purpose:
    // • currentFilmId, isFilmLoaded — would trigger an extra run when no request is needed (the condition above prevents it).
    // • isFilmLoading — could cause an infinite loop of requests on loading error.
    //
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filmId, dispatch]);

  if (isFilmLoading) {
    return <LoadingPage />;
  }

  if (isFilmLoadFailed || !film) {
    return (isNotFound)
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

  const { name, posterImage, backgroundImage } = film;

  const tabs: Tabs = [
    {
      title: FilmSections.Overview,
      content: <FilmOverview film={film} />
    },
    {
      title: FilmSections.Details,
      content: <FilmDetails film={film} />
    },
    {
      title: FilmSections.Reviews,
      content: <Reviews filmId={filmId} />
    }
  ];

  return (
    <>
      <Helmet>
        <title>{PageTitle.Film}</title>
      </Helmet>
      <section className="film-card film-card--full">
        <div className="film-card__hero">
          <div className="film-card__bg">
            <img src={backgroundImage} alt={name} />
          </div>
          <h1 className="visually-hidden">WTW</h1>
          <SiteHeader className="film-card__head" withUserNavigation />
          <div className="film-card__wrap">
            <FilmHeader film={film} />
          </div>
        </div>

        <div className="film-card__wrap film-card__translate-top">
          <div className="film-card__info">
            <div className="film-card__poster film-card__poster--big">
              <img src={posterImage} alt={`${name} poster`} width="218" height="327" />
            </div>

            <FilmTaber tabs={tabs} tabSearchParam={FILM_TABER_ACTIVE_TAB_SEARCH_PARAM} />
          </div>
        </div>
      </section>

      <div className="page-content">
        <SimilarFilms filmId={filmId} />
        <SiteFooter />
      </div>
    </>
  );
}

export default FilmPage;
