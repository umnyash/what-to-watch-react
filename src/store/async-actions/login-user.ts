import { createAppAsyncThunk } from '../../hooks';
import { APIRoute, SliceName } from '../../const';
import { AuthUser, User, AuthData } from '../../types/user';
import { saveToken } from '../../services/token';

export const loginUser = createAppAsyncThunk<User, AuthData>(
  `${SliceName.User}/login`,
  async (authData, { extra: { api, isApiError }, rejectWithValue }) => {

    try {
      const { data: { token, ...user } } = await api.post<AuthUser>(APIRoute.Login, authData);
      saveToken(token);
      return user;
    } catch (err) {
      return (isApiError(err) && err.response)
        ? rejectWithValue({ data: err.response.data })
        : rejectWithValue('Unexpected error');
    }
  },
);
