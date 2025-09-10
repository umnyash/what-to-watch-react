import { RequestStatus, SliceName } from '../../const';
import { State } from '../../types/state';

import { reviewSelectors } from './review.selectors';

describe('Selectors: review', () => {
  const sliceName = SliceName.Review;

  const state: Pick<State, SliceName.Review> = {
    [sliceName]: {
      submittingStatus: RequestStatus.Idle
    }
  };

  it.each([
    [RequestStatus.Idle, false],
    [RequestStatus.Pending, true],
    [RequestStatus.Success, false],
    [RequestStatus.Error, false],
  ])(
    'when submitting status is %s – isSubmitting → %s',
    (submittingStatus, expectedIsSubmittingValue) => {
      state[sliceName].submittingStatus = submittingStatus;

      expect(reviewSelectors.isSubmitting(state)).toBe(expectedIsSubmittingValue);
    }
  );
});
