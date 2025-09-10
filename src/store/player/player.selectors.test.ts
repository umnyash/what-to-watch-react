import { SliceName } from '../../const';
import { State } from '../../types/state';

import { playerSelectors } from './player.selectors';

describe('Selectors: player', () => {
  const sliceName = SliceName.Player;

  const state: Pick<State, SliceName.Player> = {
    [sliceName]: {
      duration: 5400,
      currentTime: 2000,
      userSelectedTime: 900,
    }
  };

  it('should return duration from state', () => {
    const { duration } = state[sliceName];
    const result = playerSelectors.duration(state);
    expect(result).toBe(duration);
  });

  it('should return user selected time from state', () => {
    const { userSelectedTime } = state[sliceName];
    const result = playerSelectors.userSelectedTime(state);
    expect(result).toBe(userSelectedTime);
  });

  it.each([
    ['00:00', 0, 0],
    ['01:30:00', 5400, 0],
    ['56:40', 5400, 2000],
    ['00:00', 5400, 5400],
  ])(
    'should return formatted remaining time (%s) as difference between duration and current time',
    (remainingTime, duration, currentTime) => {
      state[sliceName].duration = duration;
      state[sliceName].currentTime = currentTime;

      const result = playerSelectors.remainingTime(state);

      expect(result).toBe(remainingTime);
    }
  );

  it.each([
    [0, 0, 0],
    [0, 0, 5400],
    [50, 2700, 5400],
    [100, 5400, 5400],
  ])(
    'should return playback progress (%i), calculated as (%i / %i) * 100 || 0',
    (playbackProgress, currentTime, duration) => {
      state[sliceName].duration = duration;
      state[sliceName].currentTime = currentTime;

      const result = playerSelectors.playbackProgress(state);

      expect(result).toBe(playbackProgress);
    }
  );
});
