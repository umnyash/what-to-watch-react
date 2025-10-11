import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StatusCodes } from 'http-status-codes';

import { APIRoute, RequestStatus, AuthorizationStatus, SliceName } from '../../const';
import { getMockUser } from '../../mocks/data';
import { withHistory, withStore } from '../../tests/render-helpers';

import UserNavigation from './user-navigation';

describe('Component: UserNavigation (integration)', () => {
  const logoutLinkText = 'Sign out';
  const { withHistoryComponent } = withHistory(<UserNavigation />);
  const mockUser = getMockUser();

  it(`should set authorizationStatus to "${AuthorizationStatus.NoAuth}" and clear user data after successful logout`, async () => {
    const { withStoreComponent, store, mockAPIAdapter } = withStore(withHistoryComponent, {
      [SliceName.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        user: mockUser,
        loggingInStatus: RequestStatus.Success,
        loginError: null,
      }
    });
    mockAPIAdapter.onDelete(APIRoute.Logout).reply(StatusCodes.NO_CONTENT);
    const user = userEvent.setup();

    render(withStoreComponent);
    const logoutLink = screen.getByText(logoutLinkText);
    await user.click(logoutLink);

    expect(store.getState()[SliceName.User]).toMatchObject({
      authorizationStatus: AuthorizationStatus.NoAuth,
      user: null,
      loggingInStatus: RequestStatus.Idle,
    });
  });
});
