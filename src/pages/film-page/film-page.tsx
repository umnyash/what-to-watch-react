import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Films } from '../../types/films';
import { Reviews } from '../../types/reviews';
import { Tabs } from '../../types/tabs';
import { AppRoute, SIMILAR_FILMS_MAX_COUNT } from '../../const';
import useAppDispatch from '../../hooks/use-app-dispatch';
import useAppSelector from '../../hooks/use-app-selector';
import { fetchFilm } from '../../store/async-actions';

import LoadingPage from '../loading-page';
import NotFoundPage from '../not-found-page';
import Logo from '../../components/logo';
import UserNavigation from '../../components/user-navigation';
import FilmTaber from '../../components/film-taber';
import FilmOverview from '../../components/film-overview';
import FilmDetails from '../../components/film-details';
import ReviewsList from '../../components/reviews-list';
import FilmsList from '../../components/films-list';

type FilmPageProps = {
  similarFilms: Films;
  reviews: Reviews;
}

function FilmPage({ reviews, similarFilms }: FilmPageProps): JSX.Element {
  const filmId = useParams().id as string;
  const dispatch = useAppDispatch();

  const film = useAppSelector((state) => state.film);
  const isFilmLoading = useAppSelector((state) => state.isFilmLoading);

  useEffect(() => {
    dispatch(fetchFilm(filmId));
  }, [filmId, dispatch]);

  if (isFilmLoading) {
    return <LoadingPage />;
  }

  if (!film) {
    return <NotFoundPage />;
  }

  const { name, genre, released, posterImage, backgroundImage } = film;

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

          <header className="page-header film-card__head">
            <Logo />
            <UserNavigation />
          </header>

          <div className="film-card__wrap">
            <div className="film-card__desc">
              <h2 className="film-card__title">{name}</h2>
              <p className="film-card__meta">
                <span className="film-card__genre">{genre}</span>
                <span className="film-card__year">{released}</span>
              </p>

              <div className="film-card__buttons">
                <button className="btn btn--play film-card__button" type="button">
                  <svg viewBox="0 0 19 19" width="19" height="19">
                    <use xlinkHref="#play-s" />
                  </svg>
                  <span>Play</span>
                </button>
                <button className="btn btn--list film-card__button" type="button">
                  <svg viewBox="0 0 19 20" width="19" height="20">
                    <use xlinkHref="#add" />
                  </svg>
                  <span>My list</span>
                  <span className="film-card__count">9</span>
                </button>
                <Link to={AppRoute.Review} className="btn film-card__button">Add review</Link>
              </div>
            </div>
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
        <section className="catalog catalog--like-this">
          <h2 className="catalog__title">More like this</h2>
          <FilmsList films={similarFilms.slice(0, SIMILAR_FILMS_MAX_COUNT)} />
        </section>

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
