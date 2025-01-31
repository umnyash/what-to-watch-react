import { AxiosInstance } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, State } from '../../types/state';

type ThunkAPI = {
  dispatch: AppDispatch;
  state: State;
  extra: {
    api: AxiosInstance;
  };
}

const createAppAsyncThunk = createAsyncThunk.withTypes<ThunkAPI>();

export default createAppAsyncThunk;
