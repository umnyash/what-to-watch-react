import createAppAsyncThunk from '../hooks/create-app-async-thunk';
import { APIRoute } from '../const';
import { Films } from '../types/films';
import { setFilms, setFilmsLoadingStatus } from './actions';

export const fetchFilms = createAppAsyncThunk<void, undefined>(
  'films/fetch',
  async (_arg, { dispatch, extra: { api } }) => {
    dispatch(setFilmsLoadingStatus(true));
    const { data } = await api.get<Films>(APIRoute.Films);
    dispatch(setFilms(data));
    dispatch(setFilmsLoadingStatus(false));
  },
);
