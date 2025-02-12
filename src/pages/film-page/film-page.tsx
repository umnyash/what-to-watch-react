import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Tabs } from '../../types/tabs';
import { SIMILAR_FILMS_MAX_COUNT } from '../../const';
import useAppDispatch from '../../hooks/use-app-dispatch';
import useAppSelector from '../../hooks/use-app-selector';
import { fetchFilm, fetchSimilarFilms, fetchReviews } from '../../store/async-actions';

import LoadingPage from '../loading-page';
import NotFoundPage from '../not-found-page';
import SiteHeader from '../../components/site-header';
import Logo from '../../components/logo';
import FilmHeader from '../../components/film-header';
import FilmTaber from '../../components/film-taber';
import FilmOverview from '../../components/film-overview';
import FilmDetails from '../../components/film-details';
import ReviewsList from '../../components/reviews-list';
import Films from '../../components/films';

function FilmPage(): JSX.Element {
  const filmId = useParams().id as string;
  const dispatch = useAppDispatch();

  const film = useAppSelector((state) => state.film);
  const isFilmLoading = useAppSelector((state) => state.isFilmLoading);
  const similarFilms = useAppSelector((state) => state.similarFilms);
  const reviews = useAppSelector((state) => state.reviews);

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

            <FilmTaber tabs={tabs} />
          </div>
        </div>
      </section>

      <div className="page-content">
        <Films heading="More like this" films={similarFilms.slice(0, SIMILAR_FILMS_MAX_COUNT)} />

        <footer className="page-footer">
          <Logo isLight />

          <div className="copyright">
            <p>© 2019 What to watch Ltd.</p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default FilmPage;
