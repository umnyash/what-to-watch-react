import { screen, render, within } from '@testing-library/react';

import { getMockBreadcrumbs } from '../../mocks/data';
import Logo from '../logo';
import Breadcrumbs from '../breadcrumbs';
import UserNavigation from '../user-navigation';

import SiteHeader from './site-header';

vi.mock('../logo', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../breadcrumbs', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../user-navigation', () => ({
  default: vi.fn(() => null)
}));

describe('Component: SiteHeader', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders only the logo when no props are provided', () => {
    render(<SiteHeader />);

    expect(Logo).toHaveBeenCalledOnce();
    expect(Logo).toHaveBeenCalledWith(
      { isLight: undefined },
      expect.anything()
    );
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(Breadcrumbs).not.toHaveBeenCalled();
    expect(UserNavigation).not.toHaveBeenCalled();
  });

  describe('heading', () => {
    it('renders heading when provided', () => {
      const mockHeading = '404 Not Found';

      render(<SiteHeader heading={mockHeading} />);
      const headingElement = screen.getByRole('heading', { name: mockHeading });

      expect(headingElement).toBeInTheDocument();
    });

    it('renders heading with embedded HTML markup', () => {
      const favoritesCount = 35;
      const mockHeading = `My list <span class="user-page__film-count">${favoritesCount}</span>`;
      const expectingHeadingText = `My list ${favoritesCount}`;

      render(<SiteHeader heading={mockHeading} />);
      const headingElement = screen.getByRole('heading', { name: expectingHeadingText });
      const counterElement = within(headingElement).getByText(favoritesCount);

      expect(headingElement).toBeInTheDocument();
      expect(counterElement).toBeInTheDocument();
    });
  });

  it('renders Breadcrumbs when breadcrumbs prop is provided', () => {
    const mockBreadcrumbs = getMockBreadcrumbs(2);

    render(<SiteHeader breadcrumbs={mockBreadcrumbs} />);
    expect(Breadcrumbs).toHaveBeenCalledOnce();
    expect(Breadcrumbs).toHaveBeenCalledWith(
      { items: mockBreadcrumbs },
      expect.anything()
    );
  });

  it('renders UserNavigation when withUserNavigation is true', () => {
    render(<SiteHeader withUserNavigation />);
    expect(UserNavigation).toHaveBeenCalledOnce();
  });
});
