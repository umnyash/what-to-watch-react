import { renderHook } from '@testing-library/react';

import { getMockReviews } from '../../mocks/data';
import { withStoreWrapper } from '../../tests/render-helpers';
import { reviewsSelectors } from '../../store/reviews/reviews.selectors';

import { useFilmReviews } from './use-film-reviews';

vi.mock('../../store/reviews/reviews.selectors', () => ({
  reviewsSelectors: {
    filmId: vi.fn(),
    isLoading: vi.fn(),
    isLoaded: vi.fn(),
    reviews: vi.fn(),
  }
}));

describe('Hook: useFilmReviews', () => {
  const sourceFilm1Id = 'id1234';
  const sourceFilm2Id = 'id0000';

  const mockReviews = getMockReviews(2);
  const mockedReviewsSelectors = vi.mocked(reviewsSelectors);

  const { WithStoreWrapper } = withStoreWrapper();

  describe.each([
    [mockReviews],
    [[]]
  ])('reviews selector returned value', (reviews) => {
    beforeEach(() => {
      mockedReviewsSelectors.reviews.mockReturnValue(reviews);
      mockedReviewsSelectors.filmId.mockReturnValue(sourceFilm1Id);
    });

    it('should return object with reviews selector returned value when id argument matches filmId', () => {
      const { result } = renderHook(
        () => useFilmReviews(sourceFilm1Id),
        { wrapper: WithStoreWrapper }
      );

      expect(result.current).toEqual({
        data: reviews
      });
    });

    it('should return object with empty array when id argument mismatch filmId', () => {
      const { result } = renderHook(
        () => useFilmReviews(sourceFilm2Id),
        { wrapper: WithStoreWrapper }
      );

      expect(result.current).toEqual({
        data: []
      });
    });
  });
});
