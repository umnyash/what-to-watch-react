import { ReactElement } from 'react';
import { screen, render } from '@testing-library/react';

import { FilmSections, FILM_TABER_ACTIVE_TAB_SEARCH_PARAM } from './const';
import { getMockPageFilm } from '../../mocks/data';
import SiteHeader from '../site-header';
import FilmHeader from '../film-header';
import FilmTaber from '../film-taber';
import FilmOverview from '../film-overview';
import FilmDetails from '../film-details';
import Reviews from '../reviews';

import Film from './film';

vi.mock('../site-header', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../film-header', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../film-taber', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../film-overview', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../film-details', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../reviews', () => ({
  default: vi.fn(() => null)
}));

describe('Component: Film', () => {
  const mockFilm = getMockPageFilm();

  beforeEach(() => vi.clearAllMocks());

  it('should render correctly', () => {
    render(<Film film={mockFilm} />);
    const backgroundImageElement = screen.getByAltText(mockFilm.name);
    const posterImageElement = screen.getByAltText(`${mockFilm.name} poster`);

    expect(backgroundImageElement).toHaveAttribute('src', mockFilm.backgroundImage);
    expect(posterImageElement).toHaveAttribute('src', mockFilm.posterImage);
    expect(SiteHeader).toHaveBeenCalledOnce();
    expect(FilmHeader).toHaveBeenCalledOnce();
    expect(SiteHeader).toHaveBeenCalledWith({
      className: 'film-card__head',
      withUserNavigation: true,
    }, expect.anything());
    expect(FilmHeader).toHaveBeenCalledWith({
      film: mockFilm,
    }, expect.anything());
  });

  it('should correctly call nested FilmTaber component', () => {
    render(<Film film={mockFilm} />);
    const [[{ tabSearchParam, tabs }]] = vi.mocked(FilmTaber).mock.calls;

    expect(FilmTaber).toHaveBeenCalledOnce();
    expect(tabSearchParam).toBe(FILM_TABER_ACTIVE_TAB_SEARCH_PARAM);

    expect(tabs).toEqual([
      {
        title: FilmSections.Overview,
        content: expect.objectContaining({
          type: FilmOverview,
          props: { film: mockFilm }
        }) as ReactElement
      },
      {
        title: FilmSections.Details,
        content: expect.objectContaining({
          type: FilmDetails,
          props: { film: mockFilm }
        }) as ReactElement
      },
      {
        title: FilmSections.Reviews,
        content: expect.objectContaining({
          type: Reviews,
          props: { filmId: mockFilm.id }
        }) as ReactElement
      }
    ]);
  });
});
