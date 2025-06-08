import createAppAsyncThunk from '../../hooks/create-app-async-thunk';
import { APIRoute, SliceName } from '../../const';
import { Films } from '../../types/films';

export const fetchFavorites = createAppAsyncThunk<Films, undefined>(
  `${SliceName.Favorites}/fetch`,
  async (_arg, { extra: { api } }) => {
    const { data } = await api.get<Films>(APIRoute.Favorites);
    return data;
  },
);
