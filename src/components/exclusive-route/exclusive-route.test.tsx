import { Routes, Route } from 'react-router-dom';
import { screen, render } from '@testing-library/react';

import { AppRoute, RequestStatus, AuthorizationStatus, SliceName } from '../../const';
import { State } from '../../types/state';
import { withHistory, withStore } from '../../tests/render-helpers';

import ExclusiveRoute from './exclusive-route';

const { PageTitle } = await import('../../const');

describe('Component: ExclusiveRoute', () => {
  let mockInitialState: Pick<State, SliceName.User>;

  beforeEach(() => {
    mockInitialState = {
      [SliceName.User]: {
        user: null,
        authorizationStatus: AuthorizationStatus.Unknown,
        loggingInStatus: RequestStatus.Idle,
        loginError: null,
      }
    };
  });

  it.each([
    {
      case: 'should render it when target route is exclusive to "AUTH" users and authorization status is "AUTH"',
      authorizationStatus: AuthorizationStatus.Auth,
      targetRoute: AppRoute.MyList,
      expectedPageHeading: PageTitle.MyList,
    },
    {
      case: 'should redirect to "/login" when target route is exclusive to "AUTH" users and authorization status is "NO_AUTH"',
      authorizationStatus: AuthorizationStatus.NoAuth,
      targetRoute: AppRoute.MyList,
      expectedPageHeading: PageTitle.Login,
    },
    {
      case: 'should render it when target route is exclusive to "NO_AUTH" users and authorization status is "NO_AUTH"',
      authorizationStatus: AuthorizationStatus.NoAuth,
      targetRoute: AppRoute.Login,
      expectedPageHeading: PageTitle.Login,
    },
    {
      case: 'should redirect to "/" when target route is exclusive to "NO_AUTH" users, authorization status is "AUTH" and there is no previous page',
      authorizationStatus: AuthorizationStatus.Auth,
      targetRoute: AppRoute.Login,
      expectedPageHeading: PageTitle.Main,
    },
    {
      case: 'should redirect to "/mylist" when target route is exclusive to "NO_AUTH" users, authorization status is "AUTH" and there is a previous page',
      authorizationStatus: AuthorizationStatus.Auth,
      targetRoute: AppRoute.Login,
      previousPageRoute: AppRoute.MyList,
      expectedPageHeading: PageTitle.MyList,
    }
  ])('$case', ({ authorizationStatus, targetRoute, previousPageRoute, expectedPageHeading }) => {
    const { withHistoryComponent } = withHistory(
      <Routes>
        <Route path={AppRoute.Root} element={
          <h1>{PageTitle.Main}</h1>
        }
        />
        <Route path={AppRoute.Login} element={
          <ExclusiveRoute onlyFor={AuthorizationStatus.NoAuth}>
            <h1>{PageTitle.Login}</h1>
          </ExclusiveRoute>
        }
        />
        <Route path={AppRoute.MyList} element={
          <ExclusiveRoute onlyFor={AuthorizationStatus.Auth}>
            <h1>{PageTitle.MyList}</h1>
          </ExclusiveRoute>
        }
        />
      </Routes>,
      targetRoute,
      { from: previousPageRoute }
    );
    mockInitialState[SliceName.User].authorizationStatus = authorizationStatus;
    const { withStoreComponent } = withStore(withHistoryComponent, mockInitialState);

    render(withStoreComponent);
    const headingElement = screen.getByRole('heading');

    expect(headingElement).toHaveTextContent(expectedPageHeading);
  });
});
