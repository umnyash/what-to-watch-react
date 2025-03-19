import { useEffect } from 'react';
import useAppDispatch from '../../hooks/use-app-dispatch';
import useAppSelector from '../../hooks/use-app-selector';
import { promoFilmSelectors } from '../../store/promo-film/promo-film.selectors';
import { fetchPromoFilm } from '../../store/async-actions';
import SiteHeader from '../../components/site-header';
import FilmHeader from '../../components/film-header';
import Catalog from '../../components/catalog';
import { Helmet } from 'react-helmet-async';
import SiteFooter from '../../components/site-footer';

function MainPage(): JSX.Element {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchPromoFilm());
  }, [dispatch]);

  const promoFilm = useAppSelector(promoFilmSelectors.film);

  return (
    <>
      <Helmet>
        <title>WTW</title>
      </Helmet>
      <section className="film-card" style={{ backgroundColor: '#180202' }}>
        {promoFilm && (
          <div className="film-card__bg">
            <img src={promoFilm.backgroundImage} alt={promoFilm.name} />
          </div>
        )}

        <h1 className="visually-hidden">WTW</h1>
        <SiteHeader className="film-card__head" withUserNavigation />

        {promoFilm && (
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

      <div className="page-content">
        <Catalog />
        <SiteFooter />
      </div>
    </>
  );
}

export default MainPage;
