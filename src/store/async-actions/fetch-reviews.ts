import { generatePath } from 'react-router-dom';
import { createAppAsyncThunk } from '../../hooks';
import { APIRoute, SliceName } from '../../const';
import { Reviews } from '../../types/reviews';

export const fetchReviews = createAppAsyncThunk<Reviews, string>(
  `${SliceName.Reviews}/fetch`,
  async (filmId, { extra: { api } }) => {
    const apiRoute = generatePath(APIRoute.Reviews, { id: filmId });
    const { data } = await api.get<Reviews>(apiRoute);
    return data;
  },
);
