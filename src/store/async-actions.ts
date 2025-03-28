import createAppAsyncThunk from '../hooks/create-app-async-thunk';
import { APIRoute, FavoriteStatus, SliceName } from '../const';
import { AuthUser, User, AuthData } from '../types/user';
import { Films, FullFilm, PageFilm, PromoFilm } from '../types/films';
import { Reviews, Review, ReviewContent } from '../types/reviews';
import { saveToken, dropToken } from '../services/token';

export const checkUserAuth = createAppAsyncThunk<User, undefined>(
  `${SliceName.User}/checkAuth`,
  async (_arg, { extra: { api } }) => {
    const { data: { name, email, avatarUrl } } = await api.get<AuthUser>(APIRoute.Login);
    return { name, email, avatarUrl };
  },
);

export const loginUser = createAppAsyncThunk<User, AuthData>(
  `${SliceName.User}/login`,
  async (authData, { extra: { api, isApiError }, rejectWithValue }) => {

    try {
      const { data: { token, ...user } } = await api.post<AuthUser>(APIRoute.Login, authData);
      saveToken(token);
      return user;
    } catch (err) {
      return (isApiError(err) && err.response)
        ? rejectWithValue({ data: err.response.data })
        : rejectWithValue('Unexpected error');
    }
  },
);

export const logoutUser = createAppAsyncThunk<void, undefined>(
  `${SliceName.User}/logout`,
  async (_arg, { extra: { api } }) => {
    await api.delete(APIRoute.Logout);
    dropToken();
  },
);

export const fetchFilms = createAppAsyncThunk<Films, undefined>(
  `${SliceName.Catalog}/fetchFilms`,
  async (_arg, { extra: { api } }) => {
    const { data } = await api.get<Films>(APIRoute.Films);
    return data;
  },
);

export const fetchSimilarFilms = createAppAsyncThunk<Films, string>(
  `${SliceName.SimilarFilms}/fetch`,
  async (filmId, { extra: { api } }) => {
    const apiRoute = `${APIRoute.Films}/${filmId}/similar`;
    const { data } = await api.get<Films>(apiRoute);
    return data;
  },
);

export const fetchFilm = createAppAsyncThunk<PageFilm, string>(
  `${SliceName.Film}/fetch`,
  async (filmId, { extra: { api, isApiError }, rejectWithValue }) => {
    const apiRoute = `${APIRoute.Films}/${filmId}`;

    try {
      const { data } = await api.get<PageFilm>(apiRoute);
      return data;
    } catch (err) {
      return (isApiError(err) && err.response)
        ? rejectWithValue({ status: err.response.status })
        : rejectWithValue('Unexpected error');
    }
  },
);

export const fetchPromoFilm = createAppAsyncThunk<PromoFilm, undefined>(
  `${SliceName.PromoFilm}/fetch`,
  async (_arg, { extra: { api } }) => {
    const { data } = await api.get<PromoFilm>(APIRoute.Promo);
    return data;
  },
);

export const fetchFavorites = createAppAsyncThunk<Films, undefined>(
  `${SliceName.Favorites}/fetch`,
  async (_arg, { extra: { api } }) => {
    const { data } = await api.get<Films>(APIRoute.Favorites);
    return data;
  },
);

export const changeFavoriteStatus = createAppAsyncThunk<
  FullFilm,
  { filmId: string; status: FavoriteStatus }
>(
  `${SliceName.Favorites}/changeStatus`,
  async ({ filmId, status }, { extra: { api } }) => {
    const apiRoute = `${APIRoute.Favorites}/${filmId}/${status}`;
    const { data } = await api.post<FullFilm>(apiRoute);
    return data;
  }
);

export const fetchReviews = createAppAsyncThunk<Reviews, string>(
  `${SliceName.Reviews}/fetch`,
  async (filmId, { extra: { api } }) => {
    const apiRoute = `${APIRoute.Reviews}/${filmId}`;
    const { data } = await api.get<Reviews>(apiRoute);
    return data;
  },
);

export const submitReview = createAppAsyncThunk<
  Review,
  {
    filmId: string;
    content: ReviewContent;
  }
>(
  `${SliceName.Reviews}/submit`,
  async ({ filmId, content }, { extra: { api } }) => {
    const apiRoute = `${APIRoute.Reviews}/${filmId}`;
    const { data } = await api.post<Review>(apiRoute, content);
    return data;
  },
);
