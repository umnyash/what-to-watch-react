import { screen, render } from '@testing-library/react';

import { getMockReview } from '../../mocks/data';

import ReviewsItem from './reviews-item';

describe('Component: ReviewsItem', () => {
  it('should render correctly', () => {
    const mockReview = getMockReview();

    render(<ReviewsItem review={mockReview} />);

    expect(screen.getByText(mockReview.user)).toBeInTheDocument();
    expect(screen.getByText(mockReview.rating)).toBeInTheDocument();
    expect(screen.getByText(mockReview.comment)).toBeInTheDocument();
  });

  it.each([
    ['2025-01-01', 'January 1, 2025'],
    ['2025-07-11', 'July 11, 2025'],
    ['2025-07-11T01:58:13.711Z', 'July 11, 2025'],
  ])('should format "%s" date to %s', (date, formattedDate) => {
    const mockReview = getMockReview({ date });
    render(<ReviewsItem review={mockReview} />);
    expect(screen.getByText(formattedDate)).toBeInTheDocument();
  });
});
