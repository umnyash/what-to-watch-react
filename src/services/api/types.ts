import { AxiosError } from 'axios';

export type ErrorResponseData = {
  message: string;
  details: { messages: string[] }[];
}

export type ErrorResponse = {
  status?: number;
  data?: ErrorResponseData;
}

export type ApiError = AxiosError<ErrorResponseData>;
