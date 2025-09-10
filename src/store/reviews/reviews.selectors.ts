import { State } from '../../types/state';
import { RequestStatus, SliceName } from '../../const';

const sliceName = SliceName.Reviews;
type SliceState = Pick<State, SliceName.Reviews>;

const filmId = (state: SliceState) => state[sliceName].filmId;
const isLoading = (state: SliceState) => state[sliceName].loadingStatus === RequestStatus.Pending;
const isLoaded = (state: SliceState) => state[sliceName].loadingStatus === RequestStatus.Success;
const reviews = (state: SliceState) => state[sliceName].reviews;

export const reviewsSelectors = {
  filmId,
  isLoading,
  isLoaded,
  reviews,
};
