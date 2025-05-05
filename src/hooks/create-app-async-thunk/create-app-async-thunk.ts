import { AxiosInstance } from 'axios';
import { ApiError, ErrorResponse } from '../../services/api';
import { createAsyncThunk } from '@reduxjs/toolkit';

type ThunkAPI = {
  extra: {
    api: AxiosInstance;
    isApiError: (error: unknown) => error is ApiError;
  };
  rejectValue: ErrorResponse | string;
}

const createAppAsyncThunk = createAsyncThunk.withTypes<ThunkAPI>();

export default createAppAsyncThunk;
