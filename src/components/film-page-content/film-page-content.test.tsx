import { HelmetProvider } from 'react-helmet-async';
import { render, waitFor } from '@testing-library/react';

import { PageTitle } from '../../const';
import { getMockPageFilm } from '../../mocks/data';
import Film from '../film';
import SimilarFilms from '../similar-films';
import SiteFooter from '../site-footer';

import FilmPageContent from './film-page-content';

vi.mock('../film', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../similar-films', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../site-footer', () => ({
  default: vi.fn(() => null)
}));

describe('Component: FilmPageContent', () => {
  const mockFilm = getMockPageFilm();

  it('should render correctly', () => {
    render(
      <HelmetProvider>
        <FilmPageContent film={mockFilm} />
      </HelmetProvider>
    );

    expect(Film).toHaveBeenCalledOnce();
    expect(SimilarFilms).toHaveBeenCalledOnce();
    expect(SiteFooter).toHaveBeenCalledOnce();
    expect(Film).toHaveBeenCalledWith(
      { film: mockFilm },
      expect.anything()
    );
    expect(SimilarFilms).toHaveBeenCalledWith(
      { filmId: mockFilm.id },
      expect.anything()
    );
  });

  it('should set page title correctly', async () => {
    render(
      <HelmetProvider>
        <FilmPageContent film={mockFilm} />
      </HelmetProvider>
    );

    await waitFor(() => expect(document.title).toBe(PageTitle.Film));
  });
});
