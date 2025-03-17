import { AuthorizationStatus, RequestStatus } from '../const';
import { User } from './user';
import { ErrorResponseData } from './api';
import { store } from '../store';

export type State = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type UserState = {
  authorizationStatus: AuthorizationStatus;
  user: User | null;
  loggingInStatus: RequestStatus;
  loginErrorData: ErrorResponseData | null;
}
