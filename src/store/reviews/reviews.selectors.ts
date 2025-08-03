import { State } from '../../types/state';
import { RequestStatus, SliceName } from '../../const';

const sliceName = SliceName.Reviews;

const filmId = (state: State) => state[sliceName].filmId;
const isLoading = (state: State) => state[sliceName].loadingStatus === RequestStatus.Pending;
const isLoaded = (state: State) => state[sliceName].loadingStatus === RequestStatus.Success;
const reviews = (state: State) => state[sliceName].reviews;

export const reviewsSelectors = {
  filmId,
  isLoading,
  isLoaded,
  reviews,
};
