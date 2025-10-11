import { render } from '@testing-library/react';

import { getMockReviews } from '../../mocks/data';
import { useFilmReviews } from '../../hooks/use-film-reviews/use-film-reviews';
import ReviewsList from '../reviews-list';

import Reviews from './reviews';

vi.mock('../../hooks/use-film-reviews/use-film-reviews', () => ({
  useFilmReviews: vi.fn()
}));

vi.mock('../reviews-list', () => ({
  default: vi.fn(() => null)
}));

describe('Component: Reviews', () => {
  it('should render correctly', () => {
    const mockRelatedFilmId = 'id1234';
    const mockReviews = getMockReviews(2);
    vi.mocked(useFilmReviews).mockReturnValue({ data: mockReviews });

    render(<Reviews filmId={mockRelatedFilmId} />);

    expect(useFilmReviews).toHaveBeenCalledOnce();
    expect(useFilmReviews).toHaveBeenCalledWith(mockRelatedFilmId);
    expect(ReviewsList).toHaveBeenCalledOnce();
    expect(ReviewsList).toHaveBeenCalledWith(
      { reviews: mockReviews }, expect.anything()
    );
  });
});
