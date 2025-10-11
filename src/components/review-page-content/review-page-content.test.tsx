import { generatePath } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { screen, render, waitFor } from '@testing-library/react';

import { AppRoute, PageTitle } from '../../const';
import { getMockPromoFilm } from '../../mocks/data';
import SiteHeader from '../site-header';
import ReviewForm from '../review-form';

import ReviewPageContent from './review-page-content';

vi.mock('../site-header', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../review-form', () => ({
  default: vi.fn(() => null)
}));

describe('Component: ReviewPageContent', () => {
  const mockFilm = getMockPromoFilm();

  it('should render correctly', () => {
    const expectedBreadcrumbs = [
      {
        text: mockFilm.name,
        href: generatePath(AppRoute.Film, { id: mockFilm.id })
      },
      {
        text: 'Add review'
      }
    ];

    render(
      <HelmetProvider>
        <ReviewPageContent film={mockFilm} />
      </HelmetProvider>
    );
    const backgroundImageElement = screen.getByAltText(mockFilm.name);
    const posterImageElement = screen.getByAltText(`${mockFilm.name} poster`);

    expect(backgroundImageElement).toHaveAttribute('src', mockFilm.backgroundImage);
    expect(posterImageElement).toHaveAttribute('src', mockFilm.posterImage);
    expect(SiteHeader).toHaveBeenCalledOnce();
    expect(SiteHeader).toHaveBeenCalledWith(
      { breadcrumbs: expectedBreadcrumbs, withUserNavigation: true }, expect.anything()
    );
    expect(ReviewForm).toHaveBeenCalledOnce();
    expect(ReviewForm).toHaveBeenCalledWith(
      { filmId: mockFilm.id }, expect.anything()
    );
  });

  it('should set page title correctly', async () => {
    render(
      <HelmetProvider>
        <ReviewPageContent film={mockFilm} />
      </HelmetProvider>
    );

    await waitFor(() => expect(document.title).toBe(PageTitle.Review));
  });
});
