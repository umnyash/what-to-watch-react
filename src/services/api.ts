import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';
import { getToken } from './token';

const BACKEND_URL = 'https://16.design.htmlacademy.pro/wtw';
const REQUEST_TIMEOUT = 5000;

type ErrorResponseData = {
  message: string;
}

const StatusCodeMapping: Record<number, boolean> = {
  [StatusCodes.BAD_REQUEST]: true,
  [StatusCodes.CONFLICT]: true,
};

const shouldDisplayError = (response: AxiosResponse) => !!StatusCodeMapping[response.status];

export const createAPI = (): AxiosInstance => {
  const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: REQUEST_TIMEOUT,
  });

  api.interceptors.request.use(
    (config) => {
      const token = getToken();

      if (token && config.headers) {
        config.headers['x-token'] = token;
      }

      return config;
    },
  );

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ErrorResponseData>) => {
      if (error.response && shouldDisplayError(error.response)) {
        const data = error.response.data;

        toast.warn(data.message);
      }
      throw error;
    }
  );

  return api;
};
