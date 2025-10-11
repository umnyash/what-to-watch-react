import { screen, render, within } from '@testing-library/react';

import { AppRoute } from '../../const';
import { getMockUser } from '../../mocks/data';
import { withHistory, withStore } from '../../tests/render-helpers';
import { userSelectors } from '../../store/user/user.selectors';

import UserNavigation from './user-navigation';

vi.mock('../../store/user/user.selectors', () => ({
  userSelectors: {
    isAuth: vi.fn(),
    isNoAuth: vi.fn(),
    user: vi.fn(),
  }
}));

describe('Component: UserNavigation', () => {
  const containerTestId = 'user-navigation';
  const loginLinkText = 'Sign in';
  const logoutLinkText = 'Sign out';
  const avatarAltText = 'User avatar';
  const { withHistoryComponent } = withHistory(<UserNavigation />);
  const mockUser = getMockUser();

  describe('should render correctly', () => {
    it('should render empty block when isAuth and isNoAuth selectors returns false', () => {
      const { withStoreComponent } = withStore(withHistoryComponent);
      vi.mocked(userSelectors).isAuth.mockReturnValue(false);
      vi.mocked(userSelectors).isNoAuth.mockReturnValue(false);

      render(withStoreComponent);
      const containerElement = screen.getByTestId(containerTestId);

      expect(containerElement).toBeEmptyDOMElement();
    });

    it('should render login link when isNoAuth selector returns true', () => {
      const { withStoreComponent } = withStore(withHistoryComponent);
      vi.mocked(userSelectors).isNoAuth.mockReturnValue(true);

      render(withStoreComponent);
      const loginLink = screen.getByRole('link', { name: loginLinkText });

      expect(loginLink).toHaveAttribute('href', AppRoute.Login);
      expect(loginLink).toHaveTextContent(loginLinkText);
    });

    it('should render favorites link with user avatar and logout link when isAuth selector returns true and user selector returns user data', () => {
      const { withStoreComponent } = withStore(withHistoryComponent);
      vi.mocked(userSelectors).isAuth.mockReturnValue(true);
      vi.mocked(userSelectors).user.mockReturnValue(mockUser);

      render(withStoreComponent);
      const favoritesLinkElement = screen.getByRole('link', { name: avatarAltText });
      const avatarElement = within(favoritesLinkElement).getByRole('img', { name: avatarAltText });
      const logoutLink = screen.getByText(logoutLinkText);

      expect(favoritesLinkElement).toHaveAttribute('href', AppRoute.MyList);
      expect(avatarElement).toHaveAttribute('src', mockUser.avatarUrl);
      expect(logoutLink).toBeInTheDocument();
    });
  });
});
