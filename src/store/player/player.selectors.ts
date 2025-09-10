import { SliceName } from '../../const';
import { State } from '../../types/state';
import { formatPlaybackDuration } from '../../util';

const sliceName = SliceName.Player;
type SliceState = Pick<State, SliceName.Player>;

const duration = (state: SliceState) => state[sliceName].duration;
const userSelectedTime = (state: SliceState) => state[sliceName].userSelectedTime;

const remainingTime = (state: SliceState) =>
  formatPlaybackDuration(state[sliceName].duration - state[sliceName].currentTime);

const playbackProgress = (state: SliceState) =>
  (state[sliceName].currentTime / state[sliceName].duration * 100) || 0;

export const playerSelectors = {
  duration,
  userSelectedTime,
  remainingTime,
  playbackProgress,
};
