import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AppRoute, AuthorizationStatus } from '../../const';

import MainPage from '../../pages/main-page/main-page';
import LoginPage from '../../pages/login-page/login-page';
import FilmPage from '../../pages/film-page/film-page';
import MyListPage from '../../pages/my-list-page/my-list-page';
import ReviewPage from '../../pages/review-page/review-page';
import PlayerPage from '../../pages/player-page/player-page';
import NotFoundPage from '../../pages/not-found-page/not-found-page';
import PrivateRoute from '../private-route/private-route';

import { PromoFilm } from '../../types/promo-film';
import { Films } from '../../types/films';

type AppProps = {
  promoFilm: PromoFilm;
  films: Films;
}

function App({ promoFilm, films }: AppProps): JSX.Element {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path={AppRoute.Root}
            element={<MainPage promoFilm={promoFilm} films={films} />}
          />
          <Route
            path={AppRoute.Login}
            element={<LoginPage />}
          />
          <Route
            path={AppRoute.Film}
            element={<FilmPage similarFilms={films} />}
          />
          <Route
            path={AppRoute.MyList}
            element={
              <PrivateRoute authorizationStatus={AuthorizationStatus.NoAuth}>
                <MyListPage films={films} />
              </PrivateRoute>
            }
          />
          <Route
            path={AppRoute.Review}
            element={
              <PrivateRoute authorizationStatus={AuthorizationStatus.NoAuth}>
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
