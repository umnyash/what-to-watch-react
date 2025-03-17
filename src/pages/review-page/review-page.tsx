import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAppSelector from '../../hooks/use-app-selector';
import { filmSelectors } from '../../store/film/film.selectors';
import useAppDispatch from '../../hooks/use-app-dispatch';
import { fetchFilm } from '../../store/async-actions';
import { AppRoute, ROUTE_PARAM_ID } from '../../const';

import LoadingPage from '../loading-page';
import NotFoundPage from '../not-found-page';
import { Helmet } from 'react-helmet-async';
import SiteHeader from '../../components/site-header';
import ReviewForm from '../../components/review-form';

function ReviewPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const film = useAppSelector(filmSelectors.film);
  const isFilmLoading = useAppSelector(filmSelectors.isLoading);
  const filmId = useParams().id as string;

  useEffect(() => {
    if (film) {
      return;
    }

    dispatch(fetchFilm(filmId));
  }, [filmId, film, dispatch]);

  if (isFilmLoading) {
    return <LoadingPage />;
  }

  if (!film) {
    return <NotFoundPage />;
  }

  const { name, posterImage, backgroundImage } = film;
  const filmPageRoute = AppRoute.Film.replace(ROUTE_PARAM_ID, filmId);

  const breadcrumbs = [
    { text: name, href: filmPageRoute },
    { text: 'Add review' }
  ];

  return (
    <section className="film-card film-card--full">
      <Helmet>
        <title>WTW: Add review</title>
      </Helmet>
      <div className="film-card__header">
        <div className="film-card__bg">
          <img src={backgroundImage} alt={name} />
        </div>
        <h1 className="visually-hidden">WTW</h1>
        <SiteHeader breadcrumbs={breadcrumbs} withUserNavigation />
        <div className="film-card__poster film-card__poster--small">
          <img src={posterImage} alt={`${name} poster`} width="218" height="327" />
        </div>
      </div>

      <div className="add-review">
        <ReviewForm filmId={filmId} />
      </div>
    </section>
  );
}

export default ReviewPage;
