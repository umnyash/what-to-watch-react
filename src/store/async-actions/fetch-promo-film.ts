import { createAppAsyncThunk } from '../../hooks';
import { APIRoute, SliceName } from '../../const';
import { PromoFilm } from '../../types/films';

export const fetchPromoFilm = createAppAsyncThunk<PromoFilm, undefined>(
  `${SliceName.PromoFilm}/fetch`,
  async (_arg, { extra: { api } }) => {
    const { data } = await api.get<PromoFilm>(APIRoute.Promo);
    return data;
  },
);
