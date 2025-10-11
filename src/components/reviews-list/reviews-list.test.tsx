import { render } from '@testing-library/react';

import ReviewsItem from '../reviews-item';
import { getMockReviews } from '../../mocks/data';

import ReviewsList from './reviews-list';

vi.mock('../reviews-item', () => ({
  default: vi.fn(() => null)
}));

describe('Component: ReviewsList', () => {
  const mockReviews = getMockReviews(2);

  it('should render correctly', () => {
    render(<ReviewsList reviews={mockReviews} />);

    expect(ReviewsItem).toHaveBeenCalledTimes(mockReviews.length);
    mockReviews.forEach((review) => {
      expect(ReviewsItem).toHaveBeenCalledWith(
        { review }, expect.anything()
      );
    });
  });
});
