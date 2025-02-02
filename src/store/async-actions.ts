import createAppAsyncThunk from '../hooks/create-app-async-thunk';
import { APIRoute, AuthorizationStatus } from '../const';
import { AuthUser, AuthData } from '../types/user';
import { Films } from '../types/films';
import { saveToken, dropToken } from '../services/token';
import { setAuthorizationStatus, setUser, setFilms, setFilmsLoadingStatus } from './actions';

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
