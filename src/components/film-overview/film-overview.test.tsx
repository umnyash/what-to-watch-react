import { screen, render } from '@testing-library/react';

import { getMockPageFilm } from '../../mocks/data';
import FilmRating from '../film-rating';

import FilmOverview from './film-overview';

vi.mock('../film-rating', () => ({
  default: vi.fn(() => null)
}));

describe('Component: FilmOverview', () => {
  it('should render correctly', () => {
    const mockFilm = getMockPageFilm();

    render(<FilmOverview film={mockFilm} />);
    const descriptionElement = screen.getByText(mockFilm.description);
    const directorNameElement = screen.getByText(`Director: ${mockFilm.director}`);
    const starringTextElement = screen.getByTestId('film-overview-starring');

    expect(descriptionElement).toBeInTheDocument();
    expect(directorNameElement).toBeInTheDocument();
    mockFilm.starring.forEach((item) => {
      expect(starringTextElement).toHaveTextContent(item);
    });
  });

  describe('film rating', () => {
    beforeEach(() => vi.clearAllMocks());

    it('should render FilmRating if there are scoresCount and rating', () => {
      const mockRating = 8;
      const mockScoresCount = 16;
      const mockFilm = getMockPageFilm({ rating: mockRating, scoresCount: mockScoresCount });

      render(<FilmOverview film={mockFilm} />);

      expect(FilmRating).toHaveBeenCalledOnce();
      expect(FilmRating).toHaveBeenCalledWith(
        { rating: mockRating, scoresCount: mockScoresCount },
        expect.anything()
      );
    });

    it('should not render FilmRating if there are when no scores or rating', () => {
      const mockFilm = getMockPageFilm({ rating: 0, scoresCount: 0 });
      render(<FilmOverview film={mockFilm} />);

      expect(FilmRating).not.toHaveBeenCalled();
    });
  });
});
