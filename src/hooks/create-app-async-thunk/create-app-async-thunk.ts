import { AxiosInstance } from 'axios';
import { ApiError } from '../../services/api';
import { ErrorResponseData } from '../../types/api';
import { createAsyncThunk } from '@reduxjs/toolkit';

type ThunkAPI = {
  extra: {
    api: AxiosInstance;
    isApiError: (error: unknown) => error is ApiError;
  };
  rejectValue: ErrorResponseData;
}

const createAppAsyncThunk = createAsyncThunk.withTypes<ThunkAPI>();

export default createAppAsyncThunk;
