import { PlayerState } from '../../types/state';
import { playerSlice, playerActions } from './player.slice';

describe('Slice: player', () => {
  it('should return current state when action is unknown', () => {
    const expectedState: PlayerState = {
      duration: 5400,
      currentTime: 2000,
      userSelectedTime: 900,
    };
    const unknownAction = { type: '' };

    const result = playerSlice.reducer(expectedState, unknownAction);

    expect(result).toEqual(expectedState);
  });

  it('should return initial state when state is undefined and action is unknown', () => {
    const initialState: PlayerState = {
      duration: 0,
      currentTime: 0,
      userSelectedTime: 0,
    };
    const unknownAction = { type: '' };

    const result = playerSlice.reducer(undefined, unknownAction);

    expect(result).toEqual(initialState);
  });

  it('should set duration on "setDuration" action', () => {
    const someDuration = 5400;
    const expectedState: PlayerState = {
      duration: someDuration,
      currentTime: 0,
      userSelectedTime: 0,
    };

    const result = playerSlice.reducer(undefined, playerActions.setDuration(someDuration));

    expect(result).toEqual(expectedState);
  });

  it('should set current time on "setCurrentTime" action', () => {
    const someCurrentTime = 2000;
    const expectedState: PlayerState = {
      duration: 0,
      currentTime: someCurrentTime,
      userSelectedTime: 0,
    };

    const result = playerSlice.reducer(undefined, playerActions.setCurrentTime(someCurrentTime));

    expect(result).toEqual(expectedState);
  });

  it('should set user selected time on "setUserSelectedTime" action', () => {
    const someUserSelectedTime = 900;
    const expectedState: PlayerState = {
      duration: 0,
      currentTime: 0,
      userSelectedTime: someUserSelectedTime,
    };

    const result = playerSlice.reducer(undefined, playerActions.setUserSelectedTime(someUserSelectedTime));

    expect(result).toEqual(expectedState);
  });

  it('should reset current time and user selected time on "resetPlayback" action', () => {
    const initialState: PlayerState = {
      duration: 5400,
      currentTime: 2000,
      userSelectedTime: 900,
    };
    const expectedState: PlayerState = {
      ...initialState,
      currentTime: 0,
      userSelectedTime: 0,
    };

    const result = playerSlice.reducer(initialState, playerActions.resetPlayback);

    expect(result).toEqual(expectedState);
  });
});
