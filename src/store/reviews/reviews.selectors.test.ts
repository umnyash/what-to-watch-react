import { RequestStatus, SliceName } from '../../const';
import { State } from '../../types/state';
import { getMockReviews } from '../../mocks/data';

import { reviewsSelectors } from './reviews.selectors';

describe('Selectors: reviews', () => {
  const sliceName = SliceName.Reviews;

  const state: Pick<State, SliceName.Reviews> = {
    [sliceName]: {
      filmId: 'some-film-id',
      loadingStatus: RequestStatus.Success,
      reviews: getMockReviews(1),
    }
  };

  it('should return film ID from state', () => {
    const { filmId } = state[sliceName];
    const result = reviewsSelectors.filmId(state);
    expect(result).toBe(filmId);
  });

  it.each([
    [RequestStatus.Idle, false, false],
    [RequestStatus.Pending, true, false],
    [RequestStatus.Success, false, true],
    [RequestStatus.Error, false, false],
  ])(
    'when loading status is %s – isLoading → %s, isLoaded → %s',
    (loadingStatus, expectedIsLoadingValue, expectedIsLoadedValue) => {
      state[sliceName].loadingStatus = loadingStatus;

      expect(reviewsSelectors.isLoading(state)).toBe(expectedIsLoadingValue);
      expect(reviewsSelectors.isLoaded(state)).toBe(expectedIsLoadedValue);
    }
  );

  it('should return reviews from state', () => {
    const { reviews } = state[sliceName];
    const result = reviewsSelectors.reviews(state);
    expect(result).toEqual(reviews);
  });
});
