import { State } from '../../types/state';
import { SliceName, RequestStatus } from '../../const';

const sliceName = SliceName.Review;
type SliceState = Pick<State, SliceName.Review>;

const isSubmitting = (state: SliceState) => state[sliceName].submittingStatus === RequestStatus.Pending;

export const reviewSelectors = {
  isSubmitting,
};
