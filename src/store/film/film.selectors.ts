import { State } from '../../types/state';
import { SliceName, RequestStatus } from '../../const';

const sliceName = SliceName.Film;

const film = (state: State) => state[sliceName].film;
const isLoading = (state: State) => state[sliceName].loadingStatus === RequestStatus.Pending;

export const filmSelectors = {
  film,
  isLoading,
};
