import createAppAsyncThunk from '../../hooks/create-app-async-thunk';
import { APIRoute, SliceName } from '../../const';
import { AuthUser, User } from '../../types/user';

export const checkUserAuth = createAppAsyncThunk<User, undefined>(
  `${SliceName.User}/checkAuth`,
  async (_arg, { extra: { api } }) => {
    const { data: { name, email, avatarUrl } } = await api.get<AuthUser>(APIRoute.Login);
    return { name, email, avatarUrl };
  },
);
