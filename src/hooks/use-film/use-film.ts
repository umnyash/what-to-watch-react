import { useEffect } from 'react';
import { PromoFilm, PageFilm } from '../../types/films';
import { useAppDispatch } from '../use-app-dispatch/use-app-dispatch';
import { useAppSelector } from '../use-app-selector/use-app-selector';
import { filmSelectors } from '../../store/film/film.selectors';
import { promoFilmSelectors } from '../../store/promo-film/promo-film.selectors';
import { fetchPromoFilm, fetchFilm } from '../../store/async-actions';

type PageFilmResult = {
  data: PageFilm | null;
  isLoading: boolean;
  isLoaded: boolean;
  isLoadFailed: boolean;
  isNotFound: boolean;
}

type PromoFilmResult = {
  data: PromoFilm | null;
  isLoading: boolean;
  isLoaded: boolean;
  isLoadFailed: boolean;
  isNotFound?: boolean;
}

function useFilm(): PromoFilmResult;
function useFilm(id: string, isDetailed?: false): PageFilmResult | PromoFilmResult;
function useFilm(id: string, isDetailed: true): PageFilmResult;

function useFilm(id?: string, isDetailed?: boolean): PageFilmResult | PromoFilmResult {
  const promoFilm = useAppSelector(promoFilmSelectors.film);
  const isPromoFilmLoading = useAppSelector(promoFilmSelectors.isLoading);
  const isPromoFilmLoaded = useAppSelector(promoFilmSelectors.isLoaded);
  const isPromoFilmLoadFailed = useAppSelector(promoFilmSelectors.isLoadFailed);

  const pageFilmId = useAppSelector(filmSelectors.id);
  const pageFilm = useAppSelector(filmSelectors.film);
  const isPageFilmLoading = useAppSelector(filmSelectors.isLoading);
  const isPageFilmLoaded = useAppSelector(filmSelectors.isLoaded);
  const isPageFilmLoadFailed = useAppSelector(filmSelectors.isLoadFailed);
  const isPageFilmNotFound = useAppSelector(filmSelectors.isNotFound);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id || isPromoFilmLoading || isPromoFilmLoaded) {
      return;
    }

    dispatch(fetchPromoFilm());

    // The effect loads promo film data only on mount.
    // If the promo film is already loading or loaded, no new request is sent.
    //
    // Excluded from dependencies on purpose:
    // • isPromoFilmLoaded — would trigger an extra run when no request is needed (the condition above prevents it).
    // • isPromoFilmLoading — could cause an infinite loop of requests on loading error.
    //
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id]);

  useEffect(() => {
    if (
      !id
      || (!isDetailed && id === promoFilm?.id)
      || (id === pageFilmId && (isPageFilmLoading || isPageFilmLoaded))
    ) {
      return;
    }

    dispatch(fetchFilm(id));

    // The effect loads film data on mount or when the id and isDetailed arguments change.
    // If the film is already loading or loaded, no new request is sent.
    //
    // Excluded from dependencies on purpose:
    // • pageFilmId, isPageFilmLoaded, promoFilm — would trigger an extra run when no request is needed (the condition above prevents it).
    // • isPageFilmLoading — could cause an infinite loop of requests on loading error.
    //
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id, isDetailed]);

  if (!id) {
    return {
      data: promoFilm,
      isLoading: isPromoFilmLoading,
      isLoaded: isPromoFilmLoaded,
      isLoadFailed: isPromoFilmLoadFailed,
    };
  }

  if (!isDetailed && id === promoFilm?.id) {
    return {
      data: promoFilm,
      isLoading: false,
      isLoaded: true,
      isLoadFailed: false,
    };
  }

  if (id === pageFilmId) {
    return {
      data: pageFilm,
      isLoading: isPageFilmLoading,
      isLoaded: isPageFilmLoaded,
      isLoadFailed: isPageFilmLoadFailed,
      isNotFound: isPageFilmNotFound,
    };
  }

  return {
    data: null,
    isLoading: false,
    isLoaded: false,
    isLoadFailed: false,
    isNotFound: false,
  };
}

export { useFilm };
