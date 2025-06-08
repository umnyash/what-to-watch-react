import { generatePath } from 'react-router-dom';
import createAppAsyncThunk from '../../hooks/create-app-async-thunk';
import { APIRoute, SliceName } from '../../const';
import { FavoriteStatus } from '../../services/api';
import { FullFilm } from '../../types/films';

export const changeFavoriteStatus = createAppAsyncThunk<
  FullFilm,
  { filmId: string; status: FavoriteStatus }
>(
  `${SliceName.Favorites}/changeStatus`,
  async ({ filmId, status }, { extra: { api } }) => {
    const apiRoute = generatePath(APIRoute.FavoriteStatus, {
      id: filmId,
      flag: String(status)
    });

    const { data } = await api.post<FullFilm>(apiRoute);
    return data;
  }
);
