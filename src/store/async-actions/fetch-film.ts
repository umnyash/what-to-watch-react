import { generatePath } from 'react-router-dom';
import { createAppAsyncThunk } from '../../hooks';
import { APIRoute, SliceName } from '../../const';
import { UNEXPECTED_ERROR } from '../../services/api';
import { PageFilm } from '../../types/films';

export const fetchFilm = createAppAsyncThunk<PageFilm, string>(
  `${SliceName.Film}/fetch`,
  async (filmId, { extra: { api, isApiError }, rejectWithValue }) => {
    const apiRoute = generatePath(APIRoute.Film, { id: filmId });

    try {
      const { data } = await api.get<PageFilm>(apiRoute);
      return data;
    } catch (err) {
      return (isApiError(err) && err.response)
        ? rejectWithValue({ status: err.response.status })
        : rejectWithValue(UNEXPECTED_ERROR);
    }
  },
);
