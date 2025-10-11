import { generatePath } from 'react-router-dom';
import { StatusCodes } from 'http-status-codes';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { APIRoute, RequestStatus, AuthorizationStatus, SliceName } from '../../const';
import { State } from '../../types/state';
import { FavoriteStatus } from '../../services/api';
import { getMockUser, getMockFullFilm } from '../../mocks/data';
import { withHistory, withStore } from '../../tests/render-helpers';

import FavoriteButton from './favorite-button';

describe('Component: FavoriteButton', () => {
  let preloadedState: Pick<State, SliceName.User | SliceName.Favorites>;
  const mockUser = getMockUser();

  beforeEach(() => {
    preloadedState = {
      [SliceName.User]: {
        user: mockUser,
        authorizationStatus: AuthorizationStatus.Auth,
        loggingInStatus: RequestStatus.Idle,
        loginError: null,

      },
      [SliceName.Favorites]: {
        films: [],
        loadingStatus: RequestStatus.Success,
        changingStatusFilmsIds: [],
      },
    };
  });

  it('should add to favorites when clicking on inactive button', async () => {
    const mockFilm = getMockFullFilm({ isFavorite: false });
    const changedMockFilm = { ...mockFilm, isFavorite: true };
    const { withHistoryComponent } = withHistory(<FavoriteButton filmId={mockFilm.id} isActive={mockFilm.isFavorite} />);
    const { withStoreComponent, store, mockAPIAdapter } = withStore(withHistoryComponent, preloadedState);
    const apiRoute = generatePath(APIRoute.FavoriteStatus, {
      id: mockFilm.id,
      flag: String(FavoriteStatus.On)
    });
    mockAPIAdapter.onPost(apiRoute).reply(StatusCodes.CREATED, changedMockFilm);
    const user = userEvent.setup();

    render(withStoreComponent);
    const buttonElement = screen.getByRole('button');
    await user.click(buttonElement);

    expect(store.getState()[SliceName.Favorites]).toMatchObject({
      films: [changedMockFilm]
    });
  });

  it('should remove from favorites when clicking on active button', async () => {
    const mockFilm = getMockFullFilm({ isFavorite: true });
    preloadedState[SliceName.Favorites].films = [mockFilm];
    const changedMockFilm = { ...mockFilm, isFavorite: false };
    const { withHistoryComponent } = withHistory(<FavoriteButton filmId={mockFilm.id} isActive={mockFilm.isFavorite} />);
    const { withStoreComponent, store, mockAPIAdapter } = withStore(withHistoryComponent, preloadedState);
    const apiRoute = generatePath(APIRoute.FavoriteStatus, {
      id: mockFilm.id,
      flag: String(FavoriteStatus.Off)
    });
    mockAPIAdapter.onPost(apiRoute).reply(StatusCodes.CREATED, changedMockFilm);
    const user = userEvent.setup();

    render(withStoreComponent);
    const buttonElement = screen.getByRole('button');
    await user.click(buttonElement);

    expect(store.getState()[SliceName.Favorites]).toMatchObject({
      films: []
    });
  });
});
