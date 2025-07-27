import { createAppAsyncThunk } from '../../hooks';
import { APIRoute, SliceName } from '../../const';
import { Films } from '../../types/films';

export const fetchFilms = createAppAsyncThunk<Films, undefined>(
  `${SliceName.Catalog}/fetchFilms`,
  async (_arg, { extra: { api } }) => {
    const { data } = await api.get<Films>(APIRoute.Films);
    return data;
  },
);
