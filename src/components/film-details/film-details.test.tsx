import { screen, render } from '@testing-library/react';
import { getMockPageFilm } from '../../mocks/data';
import FilmDetails from './film-details';

describe('Component: FilmDetails', () => {
  it('should render correctly', () => {
    const mockFilm = getMockPageFilm();

    render(<FilmDetails film={mockFilm} />);
    const starringTextElement = screen.getByTestId('film-details-starring');

    expect(screen.getByText(mockFilm.director)).toBeInTheDocument();
    expect(screen.getByText(mockFilm.genre)).toBeInTheDocument();
    expect(screen.getByText(mockFilm.released)).toBeInTheDocument();
    mockFilm.starring.forEach((item) => {
      expect(starringTextElement).toHaveTextContent(item);
    });
  });

  it.each([
    [59, '59m'],
    [60, '1h 0m'],
    [61, '1h 1m'],
    [119, '1h 59m'],
    [120, '2h 0m'],
    [155, '2h 35m'],
  ])('should render run time (%i minutes) as "%s"', (runTime, formattedRunTime) => {
    const mockFilm = getMockPageFilm({ runTime });
    render(<FilmDetails film={mockFilm} />);
    expect(screen.getByText(formattedRunTime)).toBeInTheDocument();
  });
});
