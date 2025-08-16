import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PageTitle } from '../../const';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { filmSelectors } from '../../store/film/film.selectors';
import { fetchFilm } from '../../store/async-actions';

import LoadingPage from '../loading-page';
import NotFoundPage from '../not-found-page';
import Film from '../../components/film';
import SimilarFilms from '../../components/similar-films';
import SiteFooter from '../../components/site-footer';
import ErrorPage from '../error-page';

function FilmPage(): JSX.Element {
  const filmId = useParams().id as string;
  const isRequestRelevant = filmId === useAppSelector(filmSelectors.id);

  const film = useAppSelector(filmSelectors.film);
  const isFilmLoading = useAppSelector(filmSelectors.isLoading);
  const isFilmLoaded = useAppSelector(filmSelectors.isLoaded);
  const isFilmLoadFailed = useAppSelector(filmSelectors.isLoadFailed);
  const isNotFound = useAppSelector(filmSelectors.isNotFound);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isRequestRelevant && (isFilmLoading || isFilmLoaded)) {

      return;
    }

    dispatch(fetchFilm(filmId));

    // The effect loads film data on mount or when filmId changes.
    // If the film is already loading or loaded, no new request is sent.
    //
    // Excluded from dependencies on purpose:
    // • isRequestRelevant, isFilmLoaded — would trigger an extra run when no request is needed (the condition above prevents it).
    // • isFilmLoading — could cause an infinite loop of requests on loading error.
    //
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filmId, dispatch]);

  if (isRequestRelevant && film) {
    return (
      <>
        <Helmet>
          <title>{PageTitle.Film}</title>
        </Helmet>

        <Film film={film} />

        <div className="page-content">
          <SimilarFilms filmId={filmId} />
          <SiteFooter />
        </div>
      </>
    );
  }

  if (isRequestRelevant && isFilmLoadFailed) {
    return (isNotFound)
      ? <NotFoundPage />
      : (
        <ErrorPage
          title={PageTitle.Film}
          text="We couldn&apos;t load the film. Please try again later."
          onRetryButtonClick={() => {
            dispatch(fetchFilm(filmId));
          }}
        />
      );
  }

  return <LoadingPage />;
}

export default FilmPage;
