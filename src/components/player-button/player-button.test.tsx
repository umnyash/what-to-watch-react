import { Routes, Route, useLocation, Location, generatePath } from 'react-router-dom';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AppRoute } from '../../const';
import { LocationState } from '../../types/location';
import { withHistory } from '../../tests/render-helpers';

import PlayerButton from './player-button';

describe('Component: PlayerButton', () => {
  const buttonText = 'Play';
  const mockFilmId = 'abc';
  const playerPagePath = generatePath(AppRoute.Player, { id: mockFilmId });
  const filmPagePath = generatePath(AppRoute.Film, { id: mockFilmId });

  it('should render correctly', () => {
    const { withHistoryComponent } = withHistory(<PlayerButton filmId={mockFilmId} />);

    render(withHistoryComponent);
    const linkElement = screen.getByRole('link', { name: buttonText });

    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', playerPagePath);
  });

  it.each([
    [AppRoute.Root, AppRoute.Root, `From: ${AppRoute.Root}`],
    [AppRoute.Film, filmPagePath, `From: ${filmPagePath}`],
  ])(
    'should navigate to player page and preserve current route in location.state.from when user clicked button',
    async (currentPageRoute, currentPath, expectedText) => {
      const MockPlayerPage = () => {
        const location = useLocation() as Location<LocationState>;
        return (
          <div>From: {location.state?.from}</div>
        );
      };
      const { withHistoryComponent } = withHistory(
        <Routes>
          <Route path={currentPageRoute} element={<PlayerButton filmId={mockFilmId} />} />
          <Route path={AppRoute.Player} element={<MockPlayerPage />} />
        </Routes>,
        currentPath
      );
      const user = userEvent.setup();

      render(withHistoryComponent);
      const linkElement = screen.getByRole('link');
      await user.click(linkElement);

      expect(screen.getByText(expectedText)).toBeInTheDocument();
    }
  );
});
