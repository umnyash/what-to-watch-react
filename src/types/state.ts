import { AuthorizationStatus, RequestStatus } from '../const';
import { User } from './user';
import { Films, PromoFilm, PageFilm } from './films';
import { Reviews } from './reviews';
import { ErrorResponse } from './api';
import { store } from '../store';

export type State = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type UserState = {
  authorizationStatus: AuthorizationStatus;
  user: User | null;
  loggingInStatus: RequestStatus;
  loginError: ErrorResponse | string | null;
}

export type CatalogState = {
  films: Films;
  filmsLoadingStatus: RequestStatus;
  genre: string;
}

export type FilmState = {
  film: PageFilm | null;
  loadingStatus: RequestStatus;
  error: ErrorResponse | string | null;
}

export type PromoFilmState = {
  film: PromoFilm | null;
  loadingStatus: RequestStatus;
}

export type SimilarFilmsState = {
  filmId: string | null;
  films: Films;
}

export type FavoritesState = {
  films: Films;
  loadingStatus: RequestStatus;
  changingStatusFilmsIds: string[];
}

export type ReviewsState = {
  filmId: string | null;
  reviews: Reviews;
  reviewSubmittingStatus: RequestStatus;
}
