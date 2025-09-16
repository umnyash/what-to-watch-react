import { screen, render } from '@testing-library/react';

import { AppRoute, RequestStatus, AuthorizationStatus, SliceName } from '../../const';
import { State } from '../../types/state';
import { withHistory, withStore } from '../../tests/render-helpers';

import App from './app';

const { PageTitle } = await import('../../const');

vi.mock('../../pages/loading-page', () => ({
  default: vi.fn(() => <h1>{PageTitle.Loading}</h1>)
}));

vi.mock('../../pages/main-page', () => ({
  default: vi.fn(() => <h1>{PageTitle.Main}</h1>)
}));

vi.mock('../../pages/film-page', () => ({
  default: vi.fn(() => <h1>{PageTitle.Film}</h1>)
}));

vi.mock('../../pages/player-page', () => ({
  default: vi.fn(() => <h1>{PageTitle.Player}</h1>)
}));

vi.mock('../../pages/login-page', () => ({
  default: vi.fn(() => <h1>{PageTitle.Login}</h1>)
}));

vi.mock('../../pages/my-list-page', () => ({
  default: vi.fn(() => <h1>{PageTitle.MyList}</h1>)
}));

vi.mock('../../pages/review-page', () => ({
  default: vi.fn(() => <h1>{PageTitle.Review}</h1>)
}));

vi.mock('../../pages/not-found-page', () => ({
  default: vi.fn(() => <h1>{PageTitle.NotFound}</h1>)
}));

describe('Component: App', () => {
  let preloadedState: Pick<State, SliceName.User>;
  vi.spyOn(window, 'scrollTo').mockImplementation(() => { });

  beforeEach(() => {
    preloadedState = {
      [SliceName.User]: {
        user: null,
        authorizationStatus: AuthorizationStatus.NoAuth,
        loggingInStatus: RequestStatus.Idle,
        loginError: null,
      },
    };
  });

  it.each([
    {
      pageTitle: PageTitle.Loading,
      condition: 'authorization status is "UNKNOWN" on any route',
      authorizationStatus: AuthorizationStatus.Unknown,
    },
    {
      pageTitle: PageTitle.Main,
      route: AppRoute.Root,
      condition: 'user navigate to "/"',
    },
    {
      pageTitle: PageTitle.Film,
      route: AppRoute.Film,
      condition: 'user navigate to "/films/some-film-id"',
    },
    {
      pageTitle: PageTitle.Player,
      route: AppRoute.Player,
      condition: 'user navigate to "/player/some-film-id"',
    },
    {
      pageTitle: PageTitle.Login,
      route: AppRoute.Login,
      condition: 'user navigate to "/login"',
    },
    {
      pageTitle: PageTitle.MyList,
      route: AppRoute.MyList,
      condition: 'user navigate to "/mylist"',
      authorizationStatus: AuthorizationStatus.Auth,
    },
    {
      pageTitle: PageTitle.Review,
      route: AppRoute.Review,
      condition: 'user navigate to "/films/some-film-id/review"',
      authorizationStatus: AuthorizationStatus.Auth,
    },
    {
      pageTitle: PageTitle.NotFound,
      route: '/unknown-route',
      condition: 'user navigate to non-existent route',
    },
  ])('should render $pageTitle when $condition', ({ pageTitle, route, authorizationStatus }) => {
    preloadedState[SliceName.User].authorizationStatus = authorizationStatus ?? AuthorizationStatus.NoAuth;
    const { withHistoryComponent, history } = withHistory(<App />);
    const { withStoreComponent } = withStore(withHistoryComponent, preloadedState);
    history.push(route ?? '/unknown-route');

    render(withStoreComponent);
    const headingElement = screen.getByRole('heading');

    expect(headingElement).toHaveTextContent(pageTitle);
  });
});
