import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AppRoute, AuthorizationStatus } from '../../const';
import useAppSelector from '../../hooks/use-app-selector';
import { selectors } from '../../store/selectors';

import MainPage from '../../pages/main-page';
import LoginPage from '../../pages/login-page';
import FilmPage from '../../pages/film-page';
import MyListPage from '../../pages/my-list-page';
import ReviewPage from '../../pages/review-page';
import PlayerPage from '../../pages/player-page';
import NotFoundPage from '../../pages/not-found-page';
import LoadingPage from '../../pages/loading-page';
import ExclusiveRoute from '../exclusive-route';

function App(): JSX.Element {
  const isAuthChecked = useAppSelector(selectors.isAuthChecked);

  if (!isAuthChecked) {
    return (
      <HelmetProvider>
        <LoadingPage />
      </HelmetProvider>
    );
  }

  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path={AppRoute.Root}
            element={<MainPage />}
          />
          <Route
            path={AppRoute.Login}
            element={
              <ExclusiveRoute onlyFor={AuthorizationStatus.NoAuth}>
                <LoginPage />
              </ExclusiveRoute>
            }
          />
          <Route
            path={AppRoute.Film}
            element={<FilmPage />}
          />
          <Route
            path={AppRoute.MyList}
            element={
              <ExclusiveRoute onlyFor={AuthorizationStatus.Auth}>
                <MyListPage />
              </ExclusiveRoute>
            }
          />
          <Route
            path={AppRoute.Review}
            element={
              <ExclusiveRoute onlyFor={AuthorizationStatus.Auth}>
                <ReviewPage />
              </ExclusiveRoute>
            }
          />
          <Route
            path={AppRoute.Player}
            element={<PlayerPage />}
          />
          <Route
            path="*"
            element={<NotFoundPage />}
          />
        </Routes>
      </BrowserRouter>

    </HelmetProvider>
  );
}

export default App;
