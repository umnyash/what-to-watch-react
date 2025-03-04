import { AxiosInstance } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

type ThunkAPI = {
  extra: {
    api: AxiosInstance;
  };
}

const createAppAsyncThunk = createAsyncThunk.withTypes<ThunkAPI>();

export default createAppAsyncThunk;
