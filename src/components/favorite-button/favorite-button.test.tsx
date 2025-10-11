import { Routes, Route, useLocation, Location, generatePath } from 'react-router-dom';
import { screen, render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AppRoute } from '../../const';
import { LocationState } from '../../types/location';
import { withHistory, withStore } from '../../tests/render-helpers';
import { userSelectors } from '../../store/user/user.selectors';
import { favoritesSelectors } from '../../store/favorites/favorites.selectors';

import FavoriteButton from './favorite-button';

vi.mock('../../store/user/user.selectors', () => ({
  userSelectors: {
    isAuth: vi.fn(),
  }
}));

vi.mock('../../store/favorites/favorites.selectors', () => ({
  favoritesSelectors: {
    films: vi.fn(),
    changingStatusFilmsIds: vi.fn(),
  }
}));

const iconsTestIds = new Map([
  [true, 'active-icon'],
  [false, 'inactive-icon'],
]);

describe('Component: FavoriteButton', () => {
  const mockFilmId = 'some-film-id';

  beforeEach(() => {
    vi.mocked(userSelectors).isAuth.mockReturnValue(false);
    vi.mocked(favoritesSelectors).films.mockReturnValue([]);
    vi.mocked(favoritesSelectors).changingStatusFilmsIds.mockReturnValue([]);
  });

  describe('login page link', () => {
    it('should render login page link when isAuth selector returns false', () => {
      const { withHistoryComponent } = withHistory(<FavoriteButton filmId={mockFilmId} isActive={false} />);
      const { withStoreComponent } = withStore(withHistoryComponent);

      render(withStoreComponent);
      const linkElement = screen.getByRole('link');

      expect(linkElement).toHaveAttribute('href', AppRoute.Login);
    });

    it('should navigate to "/login" and preserve current route in location.state.from when user clicked link', async () => {
      const mockFilmRoute = generatePath(AppRoute.Film, { id: mockFilmId });
      const MockLoginPage = () => {
        const location = useLocation() as Location<LocationState>;
        return (
          <div>From: {location.state?.from}</div>
        );
      };
      const { withHistoryComponent } = withHistory(
        <Routes>
          <Route path={AppRoute.Film} element={<FavoriteButton filmId={mockFilmId} isActive={false} />} />
          <Route path={AppRoute.Login} element={<MockLoginPage />} />
        </Routes>,
        mockFilmRoute
      );
      const { withStoreComponent } = withStore(withHistoryComponent);
      const expectedText = `From: ${mockFilmRoute}`;
      const user = userEvent.setup();

      render(withStoreComponent);
      const linkElement = screen.getByRole('link');
      await user.click(linkElement);

      expect(screen.getByText(expectedText)).toBeInTheDocument();
    });
  });

  describe('favorite button', () => {
    const getWrappedFavoriteButton = (isActive: boolean = false) => {
      const { withHistoryComponent } = withHistory(<FavoriteButton filmId={mockFilmId} isActive={isActive} />);
      const { withStoreComponent } = withStore(withHistoryComponent);
      vi.mocked(userSelectors).isAuth.mockReturnValue(true);
      return withStoreComponent;
    };

    it.each([
      ['inactive', false],
      ['active', true],
    ])(
      'should render %s favorite button when isAuth selector returns true and "isActive" prop is %s',
      (_, isActive) => {
        render(getWrappedFavoriteButton(isActive));
        const buttonElement = screen.getByRole('button');
        const iconElement = within(buttonElement).getByTestId(iconsTestIds.get(isActive) as string);

        expect(buttonElement).toHaveAttribute('aria-pressed', String(isActive));
        expect(iconElement).toBeInTheDocument();
      }
    );

    it.each([
      true,
      false,
    ])('should toggle button when isActive prop changes', (isActive) => {
      const toggledIsActive = !isActive;

      const { rerender } = render(getWrappedFavoriteButton(isActive));
      rerender(getWrappedFavoriteButton(toggledIsActive));
      const buttonElement = screen.getByRole('button');
      const iconElement = within(buttonElement).getByTestId(iconsTestIds.get(toggledIsActive) as string);

      expect(buttonElement).toHaveAttribute('aria-pressed', String(toggledIsActive));
      expect(iconElement).toBeInTheDocument();
    });

    it.each([
      {
        case: 'should not disabled button when changingStatusFilmsIds selector returns array without filmId prop value',
        filmsIds: [],
        shouldDisabled: false,
      },
      {
        case: 'should disabled button when changingStatusFilmsIds selector returns array with filmId prop value',
        filmsIds: [mockFilmId],
        shouldDisabled: true,
      },
    ])('$case', ({ filmsIds, shouldDisabled }) => {
      vi.mocked(favoritesSelectors).changingStatusFilmsIds.mockReturnValue(filmsIds);

      render(getWrappedFavoriteButton());
      const buttonElement = screen.getByRole('button');

      if (shouldDisabled) {
        expect(buttonElement).toBeDisabled();
      } else {
        expect(buttonElement).not.toBeDisabled();
      }
    });
  });
});
