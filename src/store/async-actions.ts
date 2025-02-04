import createAppAsyncThunk from '../hooks/create-app-async-thunk';
import { APIRoute, AuthorizationStatus } from '../const';
import { AuthUser, AuthData } from '../types/user';
import { Films, PageFilm } from '../types/films';
import { Reviews } from '../types/reviews';
import { saveToken, dropToken } from '../services/token';

import {
  setAuthorizationStatus,
  setUser,
  setFilms,
  setFilmsLoadingStatus,
  setFilm,
  setFilmLoadingStatus,
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

export const fetchReviews = createAppAsyncThunk<void, string>(
  'reviews/fetch',
  async (filmId, { dispatch, extra: { api } }) => {
    const apiRoute = `${APIRoute.Reviews}/${filmId}`;
    const { data } = await api.get<Reviews>(apiRoute);
    dispatch(setReviews(data));
  }
);
