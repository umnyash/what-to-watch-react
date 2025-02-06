import createAppAsyncThunk from '../hooks/create-app-async-thunk';
import { APIRoute, AuthorizationStatus } from '../const';
import { AuthUser, AuthData } from '../types/user';
import { Films, PageFilm, PromoFilm } from '../types/films';
import { Reviews, Review, ReviewContent } from '../types/reviews';
import { saveToken, dropToken } from '../services/token';

import {
  setAuthorizationStatus,
  setUser,
  setFilms,
  setFilmsLoadingStatus,
  setSimilarFilms,
  setFilm,
  setFilmLoadingStatus,
  setPromoFilm,
  setFavorites,
  setReviews,
} from './actions';

export const checkUserAuth = createAppAsyncThunk<void, undefined>(
  'user/checkAuth',
  async (_arg, { dispatch, extra: { api } }) => {
    try {
      const { data: { name, email, avatarUrl } } = await api.get<AuthUser>(APIRoute.Login);
      dispatch(setAuthorizationStatus(AuthorizationStatus.Auth));
      dispatch(setUser({ name, email, avatarUrl }));
    } catch {
      dispatch(setAuthorizationStatus(AuthorizationStatus.NoAuth));
    }
  },
);

export const loginUser = createAppAsyncThunk<void, AuthData>(
  'user/login',
  async (authData, { dispatch, extra: { api } }) => {
    const { data: { token, ...user } } = await api.post<AuthUser>(APIRoute.Login, authData);
    saveToken(token);
    dispatch(setUser(user));
    dispatch(setAuthorizationStatus(AuthorizationStatus.Auth));
  }
);

export const logoutUser = createAppAsyncThunk<void, undefined>(
  'user/logout',
  async (_arg, { dispatch, extra: { api } }) => {
    await api.delete(APIRoute.Logout);
    dropToken();
    dispatch(setAuthorizationStatus(AuthorizationStatus.NoAuth));
  }
);

export const fetchFilms = createAppAsyncThunk<void, undefined>(
  'films/fetch',
  async (_arg, { dispatch, extra: { api } }) => {
    dispatch(setFilmsLoadingStatus(true));
    const { data } = await api.get<Films>(APIRoute.Films);
    dispatch(setFilms(data));
    dispatch(setFilmsLoadingStatus(false));
  },
);

export const fetchSimilarFilms = createAppAsyncThunk<void, string>(
  'films/fetchSimilar',
  async (filmId, { dispatch, extra: { api } }) => {
    const apiRoute = `${APIRoute.Films}/${filmId}/similar`;
    const { data } = await api.get<Films>(apiRoute);
    dispatch(setSimilarFilms(data));
  },
);

export const fetchFilm = createAppAsyncThunk<void, string>(
  'film/fetch',
  async (filmId, { dispatch, extra: { api } }) => {
    dispatch(setFilmLoadingStatus(true));
    const apiRoute = `${APIRoute.Films}/${filmId}`;

    try {
      const { data } = await api.get<PageFilm>(apiRoute);
      dispatch(setFilm(data));
    } catch {
      dispatch(setFilm(null));
    } finally {
      dispatch(setFilmLoadingStatus(false));
    }
  }
);

export const fetchPromoFilm = createAppAsyncThunk<void, undefined>(
  'film/fetchPromo',
  async (_arg, { dispatch, extra: { api } }) => {
    const { data } = await api.get<PromoFilm>(APIRoute.Promo);
    dispatch(setPromoFilm(data));
  },
);

export const fetchFavorites = createAppAsyncThunk<void, undefined>(
  'favorites/fetch',
  async (_arg, { dispatch, extra: { api } }) => {
    const { data } = await api.get<Films>(APIRoute.Favorites);
    dispatch(setFavorites(data));
  }
);

export const fetchReviews = createAppAsyncThunk<void, string>(
  'reviews/fetch',
  async (filmId, { dispatch, extra: { api } }) => {
    const apiRoute = `${APIRoute.Reviews}/${filmId}`;
    const { data } = await api.get<Reviews>(apiRoute);
    dispatch(setReviews(data));
  }
);

export const sendReview = createAppAsyncThunk<
  void,
  {
    filmId: string;
    content: ReviewContent;
  }
>(
  'review/send',
  async ({ filmId, content }, { dispatch, getState, extra: { api } }) => {
    const apiRoute = `${APIRoute.Reviews}/${filmId}`;
    const { data } = await api.post<Review>(apiRoute, content);
    const reviews = getState().reviews;
    dispatch(setReviews([data, ...reviews]));
  }
);
