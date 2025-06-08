import createAppAsyncThunk from '../../hooks/create-app-async-thunk';
import { APIRoute, SliceName } from '../../const';
import { dropToken } from '../../services/token';

export const logoutUser = createAppAsyncThunk<void, undefined>(
  `${SliceName.User}/logout`,
  async (_arg, { extra: { api } }) => {
    await api.delete(APIRoute.Logout);
    dropToken();
  },
);
