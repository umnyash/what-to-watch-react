import axios, { AxiosInstance, AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { BACKEND_URL, REQUEST_TIMEOUT } from './const';
import { ErrorResponseData } from './types';
import { getToken } from '../token';
import { shouldDisplayError } from './utils';

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
      if (!error.response) {
        toast.warn('Network error: please check your internet connection and try again.');
      } else if (shouldDisplayError(error.response)) {
        const data = error.response.data;
        toast.warn(data.message);
      }

      throw error;
    }
  );

  return api;
};
