import { useEffect } from 'react';
import useAppDispatch from '../../hooks/use-app-dispatch';
import useAppSelector from '../../hooks/use-app-selector';
import { promoFilmSelectors } from '../../store/promo-film/promo-film.selectors';
import { fetchPromoFilm } from '../../store/async-actions';
import SiteHeader from '../site-header';
import FilmHeader from '../film-header';
import Spinner from '../spinner';
import ErrorMessage from '../error-message';

function PromoFilm(): JSX.Element {
  const promoFilm = useAppSelector(promoFilmSelectors.film);
  const isLoading = useAppSelector(promoFilmSelectors.isLoading);
  const isLoaded = useAppSelector(promoFilmSelectors.isLoaded);
  const isLoadFailed = useAppSelector(promoFilmSelectors.isLoadFailed);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (promoFilm) {
      return;
    }

    dispatch(fetchPromoFilm());
  }, [promoFilm, dispatch]);


  return (
    <section className="film-card" style={{ backgroundColor: '#180202' }}>

      {isLoaded && promoFilm && (
        <div className="film-card__bg">
          <img src={promoFilm.backgroundImage} alt={promoFilm.name} />
        </div>
      )}

      <h1 className="visually-hidden">WTW</h1>
      <SiteHeader className="film-card__head" withUserNavigation />

      {isLoading && <Spinner />}

      {isLoadFailed && (
        <ErrorMessage
          text="We couldn&apos;t load the promo film. Please try again later."
          onRetryButtonClick={() => {
            dispatch(fetchPromoFilm());
          }}
        />
      )}

      {isLoaded && promoFilm && (
        <div className="film-card__wrap">
          <div className="film-card__info">
            <div className="film-card__poster">
              <img src={promoFilm.posterImage} alt={`${promoFilm.name} poster`} width="218" height="327" />
            </div>

            <FilmHeader film={promoFilm} />
          </div>
        </div>
      )}
    </section>
  );
}

export default PromoFilm;
