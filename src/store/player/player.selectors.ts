import { SliceName } from '../../const';
import { State } from '../../types/state';
import { formatPlaybackDuration } from '../../util';

const sliceName = SliceName.Player;

const duration = (state: State) => state[sliceName].duration;
const userSelectedTime = (state: State) => state[sliceName].userSelectedTime;

const remainingTime = (state: State) =>
  formatPlaybackDuration(state[sliceName].duration - state[sliceName].currentTime);

const playbackProgress = (state: State) =>
  (100 / state[sliceName].duration * state[sliceName].currentTime) || 0;

export const playerSelectors = {
  duration,
  userSelectedTime,
  remainingTime,
  playbackProgress,
};
