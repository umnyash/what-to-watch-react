import { generatePath } from 'react-router-dom';
import { screen, render } from '@testing-library/react';

import { AppRoute } from '../../const';
import { withHistory, withStore } from '../../tests/render-helpers';
import { userSelectors } from '../../store/user/user.selectors';
import { getMockPromoFilm } from '../../mocks/data';
import PlayerButton from '../player-button';
import FavoriteButton from '../favorite-button';

import FilmHeader from './film-header';

vi.mock('../player-button', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../favorite-button', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../../store/user/user.selectors', () => ({
  userSelectors: {
    isAuth: vi.fn()
  }
}));

describe('Component: FilmHeader', () => {
  const mockFilm = getMockPromoFilm();
  const { withHistoryComponent } = withHistory(<FilmHeader film={mockFilm} />);
  const { withStoreComponent } = withStore(withHistoryComponent);

  it('should render correctly', () => {
    render(withStoreComponent);
    const heading = screen.getByRole('heading', { level: 2, name: mockFilm.name });

    expect(heading).toBeInTheDocument();
    expect(screen.getByText(mockFilm.genre)).toBeInTheDocument();
    expect(screen.getByText(mockFilm.released)).toBeInTheDocument();
    expect(PlayerButton).toHaveBeenCalledOnce();
    expect(PlayerButton).toHaveBeenCalledWith(
      { filmId: mockFilm.id },
      expect.anything()
    );
    expect(FavoriteButton).toHaveBeenCalledOnce();
    expect(FavoriteButton).toHaveBeenCalledWith(
      { filmId: mockFilm.id, isActive: mockFilm.isFavorite },
      expect.anything()
    );
  });

  describe('review page link', () => {
    const reviewLinkText = /review/;

    it('should render review page link when isAuth selector returns true', () => {
      vi.mocked(userSelectors).isAuth.mockReturnValue(true);
      const reviewPageRoute = generatePath(AppRoute.Review, { id: mockFilm.id });

      render(withStoreComponent);
      const linkElement = screen.getByRole('link', { name: reviewLinkText });

      expect(linkElement).toBeInTheDocument();
      expect(linkElement).toHaveAttribute('href', reviewPageRoute);
    });

    it('should not render review page link when isAuth selector returns false', () => {
      vi.mocked(userSelectors).isAuth.mockReturnValue(false);

      render(withStoreComponent);
      const linkElement = screen.queryByRole('link', { name: reviewLinkText });

      expect(linkElement).not.toBeInTheDocument();
    });
  });
});
