import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SliceName } from '../../const';
import { PlayerState } from '../../types/state';

const initialState: PlayerState = {
  duration: 0,
  currentTime: 0,
  userSelectedTime: 0,
};

export const player = createSlice({
  name: SliceName.Player,
  initialState,
  reducers: {
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
    setUserSelectedTime: (state, action: PayloadAction<number>) => {
      state.userSelectedTime = action.payload;
    },
    resetPlayback: (state) => {
      state.currentTime = 0;
      state.userSelectedTime = 0;
    },
  },
});

export const playerActions = player.actions;
