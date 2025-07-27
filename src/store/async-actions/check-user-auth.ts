import { createAppAsyncThunk } from '../../hooks';
import { APIRoute, SliceName } from '../../const';
import { AuthUser, User } from '../../types/user';
import { omit } from '../../util';

export const checkUserAuth = createAppAsyncThunk<User, undefined>(
  `${SliceName.User}/checkAuth`,
  async (_arg, { extra: { api } }) => {
    const { data } = await api.get<AuthUser>(APIRoute.Login);
    const user = omit(data, 'token');
    return user;
  },
);
