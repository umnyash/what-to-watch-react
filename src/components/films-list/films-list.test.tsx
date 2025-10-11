import { ComponentType } from 'react';
import { render } from '@testing-library/react';

import { getMockFilms } from '../../mocks/data';
import withVideo from '../../hocs/with-video';
import FilmCard from '../film-card';

import FilmsList from './films-list';

vi.mock('../film-card', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../../hocs/with-video', () => ({
  default: vi.fn((Component: ComponentType) => Component)
}));

describe('Component: FilmsList', () => {
  const mockFilms = getMockFilms(3);

  it('should render correctly', () => {
    render(<FilmsList films={mockFilms} />);
    const filmCardCalls = vi.mocked(FilmCard).mock.calls;

    expect(withVideo).toHaveBeenCalledOnce();
    expect(withVideo).toHaveBeenCalledWith(FilmCard);
    expect(filmCardCalls).toHaveLength(mockFilms.length);

    mockFilms.forEach((film, index) => {
      expect(FilmCard).toHaveBeenNthCalledWith(
        index + 1,
        { film },
        expect.anything()
      );
    });
  });
});
