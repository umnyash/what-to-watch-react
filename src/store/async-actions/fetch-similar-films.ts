import { generatePath } from 'react-router-dom';
import createAppAsyncThunk from '../../hooks/create-app-async-thunk';
import { APIRoute, SliceName } from '../../const';
import { Films } from '../../types/films';

export const fetchSimilarFilms = createAppAsyncThunk<Films, string>(
  `${SliceName.SimilarFilms}/fetch`,
  async (filmId, { extra: { api } }) => {
    const apiRoute = generatePath(APIRoute.SimilarFilms, { id: filmId });
    const { data } = await api.get<Films>(apiRoute);
    return data;
  },
);
