import { screen, render } from '@testing-library/react';
import { RatingLevel } from '../../const';
import FilmRating from './film-rating';

describe('Component: FilmRating', () => {
  const mockScoresCount = 360;
  const mockRating = 7.4;

  it.each([
    [8, '8,0'],
    [8.1, '8,1'],
    [8.14, '8,1'],
    [8.15, '8,2'],
  ])('should render rating %f rounded to one decimal place with comma separator', (rating, formattedRating) => {
    render(<FilmRating rating={rating} scoresCount={mockScoresCount} />);
    const ratingValueElement = screen.getByText(formattedRating);

    expect(ratingValueElement).toBeInTheDocument();
  });

  it.each([
    [0, RatingLevel.Bad],
    [2.9, RatingLevel.Bad],
    [3, RatingLevel.Normal],
    [4.9, RatingLevel.Normal],
    [5, RatingLevel.Good],
    [7.9, RatingLevel.Good],
    [8, RatingLevel.VeryGood],
    [9.9, RatingLevel.VeryGood],
    [10, RatingLevel.Awesome],
  ])('should render correct rating level for %f rating', (ratingValue, ratingLevel) => {
    render(<FilmRating rating={ratingValue} scoresCount={mockScoresCount} />);
    const ratingLevelElement = screen.getByText(ratingLevel);

    expect(ratingLevelElement).toBeInTheDocument();
  });

  it('should correctly render scores count', () => {
    const expectedText = `${mockScoresCount} ratings`;
    render(<FilmRating rating={mockRating} scoresCount={mockScoresCount} />);
    expect(screen.getByText(expectedText)).toBeInTheDocument();
  });
});
