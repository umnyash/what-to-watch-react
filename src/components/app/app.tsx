import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AppRoute, AuthorizationStatus } from '../../const';
import useAppSelector from '../../hooks/use-app-selector';

import MainPage from '../../pages/main-page';
import LoginPage from '../../pages/login-page';
import FilmPage from '../../pages/film-page';
import MyListPage from '../../pages/my-list-page';
import ReviewPage from '../../pages/review-page';
import PlayerPage from '../../pages/player-page';
import NotFoundPage from '../../pages/not-found-page';
import LoadingPage from '../../pages/loading-page';
import PrivateRoute from '../private-route';
import AnonymousRoute from '../anonymous-route';

function App(): JSX.Element {
  const authorizationStatus = useAppSelector((state) => state.authorizationStatus);

  if (authorizationStatus === AuthorizationStatus.Unknown) {
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
              <AnonymousRoute>
                <LoginPage />
              </AnonymousRoute>
            }
          />
          <Route
            path={AppRoute.Film}
            element={<FilmPage />}
          />
          <Route
            path={AppRoute.MyList}
            element={
              <PrivateRoute>
                <MyListPage />
              </PrivateRoute>
            }
          />
          <Route
            path={AppRoute.Review}
            element={
              <PrivateRoute>
                <ReviewPage />
              </PrivateRoute>
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
