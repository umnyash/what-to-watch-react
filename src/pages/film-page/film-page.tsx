import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FilmSections, FILM_TABER_ACTIVE_TAB_SEARCH_PARAM } from './const';
import useAppDispatch from '../../hooks/use-app-dispatch';
import useAppSelector from '../../hooks/use-app-selector';
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
  const dispatch = useAppDispatch();

  const film = useAppSelector(filmSelectors.film);
  const isFilmLoading = useAppSelector(filmSelectors.isLoading);
  const isFilmLoadFailed = useAppSelector(filmSelectors.isLoadFailed);
  const isNotFound = useAppSelector(filmSelectors.isNotFound);

  useEffect(() => {
    if (film?.id === filmId) {
      return;
    }

    dispatch(fetchFilm(filmId));
  }, [film, filmId, dispatch]);

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
        <title>WTW: Film</title>
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
