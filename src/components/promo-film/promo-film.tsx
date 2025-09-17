import { useAppDispatch, useFilm } from '../../hooks';
import { fetchPromoFilm } from '../../store/async-actions';
import SiteHeader from '../site-header';
import FilmHeader from '../film-header';
import Spinner from '../spinner';
import ErrorMessage from '../error-message';

function PromoFilm(): JSX.Element {
  const { data, isLoading, isLoadFailed } = useFilm();
  const dispatch = useAppDispatch();

  return (
    <section className="film-card" style={{ backgroundColor: '#180202' }}>

      {data && (
        <div className="film-card__bg">
          <img src={data.backgroundImage} alt={data.name} />
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

      {data && (
        <div className="film-card__wrap">
          <div className="film-card__info">
            <div className="film-card__poster">
              <img src={data.posterImage} alt={`${data.name} poster`} width="218" height="327" />
            </div>

            <FilmHeader film={data} />
          </div>
        </div>
      )}
    </section>
  );
}

export default PromoFilm;
