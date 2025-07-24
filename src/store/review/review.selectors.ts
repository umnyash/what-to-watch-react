import { State } from '../../types/state';
import { SliceName, RequestStatus } from '../../const';

const sliceName = SliceName.Review;

const isSubmitting = (state: State) => state[sliceName].submittingStatus === RequestStatus.Pending;

export const reviewSelectors = {
  isSubmitting,
};
