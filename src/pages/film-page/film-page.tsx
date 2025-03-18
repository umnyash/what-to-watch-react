import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SIMILAR_FILMS_MAX_COUNT } from '../../const';
import { FILM_TABER_ACTIVE_TAB_SEARCH_PARAM } from './const';
import useAppDispatch from '../../hooks/use-app-dispatch';
import useAppSelector from '../../hooks/use-app-selector';
import { filmSelectors } from '../../store/film/film.selectors';
import { similarFilmsSelectors } from '../../store/similar-films/similar-films.selectors';
import { reviewsSelectors } from '../../store/reviews/reviews.selector';
import { fetchFilm, fetchSimilarFilms, fetchReviews } from '../../store/async-actions';

import LoadingPage from '../loading-page';
import NotFoundPage from '../not-found-page';
import SiteHeader from '../../components/site-header';
import FilmHeader from '../../components/film-header';
import FilmTaber, { Tabs } from '../../components/film-taber';
import FilmOverview from '../../components/film-overview';
import FilmDetails from '../../components/film-details';
import ReviewsList from '../../components/reviews-list';
import Films from '../../components/films';
import SiteFooter from '../../components/site-footer';

function FilmPage(): JSX.Element {
  const filmId = useParams().id as string;
  const dispatch = useAppDispatch();

  const film = useAppSelector(filmSelectors.film);
  const isFilmLoading = useAppSelector(filmSelectors.isLoading);
  const similarFilms = useAppSelector(similarFilmsSelectors.films);
  const reviews = useAppSelector(reviewsSelectors.reviews);

  useEffect(() => {
    dispatch(fetchFilm(filmId));
    dispatch(fetchSimilarFilms(filmId));
    dispatch(fetchReviews(filmId));
  }, [filmId, dispatch]);

  if (isFilmLoading) {
    return <LoadingPage />;
  }

  if (!film) {
    return <NotFoundPage />;
  }

  const { name, posterImage, backgroundImage } = film;

  const tabs: Tabs = [
    {
      title: 'Overview',
      content: <FilmOverview film={film} />
    },
    {
      title: 'Details',
      content: <FilmDetails film={film} />
    },
    {
      title: 'Reviews',
      content: <ReviewsList reviews={reviews} />
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
        <Films heading="More like this" films={similarFilms.slice(0, SIMILAR_FILMS_MAX_COUNT)} />
        <SiteFooter />
      </div>
    </>
  );
}

export default FilmPage;
