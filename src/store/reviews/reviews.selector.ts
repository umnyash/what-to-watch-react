import { State } from '../../types/state';
import { SliceName, RequestStatus } from '../../const';

const sliceName = SliceName.Reviews;

const filmId = (state: State) => state[sliceName].filmId;
const reviews = (state: State) => state[sliceName].reviews;
const isReviewSubmitting = (state: State) => state[sliceName].reviewSubmittingStatus === RequestStatus.Pending;

export const reviewsSelectors = {
  filmId,
  reviews,
  isReviewSubmitting,
};
