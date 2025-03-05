import { State } from '../types/state';
import { AuthorizationStatus, RequestStatus } from '../const';

export const selectors = {
  authorizationStatus: (state: State) => state.authorizationStatus,
  isAuthChecked: (state: State) => state.authorizationStatus !== AuthorizationStatus.Unknown,
  isAuth: (state: State) => state.authorizationStatus === AuthorizationStatus.Auth,
  isNoAuth: (state: State) => state.authorizationStatus === AuthorizationStatus.NoAuth,
  isLoggingIn: (state: State) => state.loggingInStatus === RequestStatus.Pending,
  user: (state: State) => state.user,
  films: (state: State) => state.films,
  isFilmsLoading: (state: State) => state.isFilmsLoading === RequestStatus.Pending,
  film: (state: State) => state.film,
  isFilmLoading: (state: State) => state.isFilmLoading === RequestStatus.Pending,
  promoFilm: (state: State) => state.promoFilm,
  similarFilms: (state: State) => state.similarFilms,
  favorites: (state: State) => state.favorites,
  reviews: (state: State) => state.reviews,
  isReviewSubmitting: (state: State) => state.reviewSubmittingStatus === RequestStatus.Pending,
  genre: (state: State) => state.genre
} as const;
