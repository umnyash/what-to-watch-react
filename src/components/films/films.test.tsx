import { screen, render } from '@testing-library/react';

import { getMockFilms } from '../../mocks/data';
import FilmsList from '../films-list';

import Films from './films';

vi.mock('../films-list', () => ({
  default: vi.fn(() => null)
}));

describe('Component: Films', () => {
  it('should render correctly', () => {
    const mockHeading = 'More like this';
    const mockFilms = getMockFilms(2);

    render(<Films heading={mockHeading} films={mockFilms} />);
    const headingElement = screen.getByRole('heading', { name: mockHeading });

    expect(headingElement).toBeInTheDocument();
    expect(FilmsList).toHaveBeenCalledOnce();
    expect(FilmsList).toHaveBeenCalledWith(
      { films: mockFilms }, expect.anything()
    );
  });
});
