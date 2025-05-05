import { AxiosError } from 'axios';
import { ErrorResponseData } from '../../types/api';

export type ApiError = AxiosError<ErrorResponseData>;
