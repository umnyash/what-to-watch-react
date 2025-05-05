import { AxiosResponse, isAxiosError } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from './types';

const StatusCodeMapping: Record<number, boolean> = {
  [StatusCodes.BAD_REQUEST]: true,
  [StatusCodes.CONFLICT]: true,
};

export const shouldDisplayError = (response: AxiosResponse) => !!StatusCodeMapping[response.status];

export const isApiError = (error: unknown): error is ApiError => isAxiosError(error);
