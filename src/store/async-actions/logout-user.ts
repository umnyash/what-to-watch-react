import { createAppAsyncThunk } from '../../hooks';
import { APIRoute, SliceName } from '../../const';
import { dropToken } from '../../services/token';

export const logoutUser = createAppAsyncThunk<void, undefined>(
  `${SliceName.User}/logout`,
  async (_arg, { extra: { api } }) => {
    await api.delete(APIRoute.Logout);
    dropToken();
  },
);
