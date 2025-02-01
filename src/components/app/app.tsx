import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AppRoute } from '../../const';

import MainPage from '../../pages/main-page';
import LoginPage from '../../pages/login-page';
import FilmPage from '../../pages/film-page';
import MyListPage from '../../pages/my-list-page';
import ReviewPage from '../../pages/review-page';
import PlayerPage from '../../pages/player-page';
import NotFoundPage from '../../pages/not-found-page';
import PrivateRoute from '../private-route';
import AnonymousRoute from '../anonymous-route';

import { PromoFilm } from '../../types/promo-film';
import { PageFilm, Films } from '../../types/films';
import { Reviews } from '../../types/reviews';

type AppProps = {
  promoFilm: PromoFilm;
  film: PageFilm;
  films: Films;
  reviews: Reviews;
}

function App({ promoFilm, film, films, reviews }: AppProps): JSX.Element {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path={AppRoute.Root}
            element={<MainPage promoFilm={promoFilm} />}
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
            element={<FilmPage film={film} reviews={reviews} similarFilms={films} />}
          />
          <Route
            path={AppRoute.MyList}
            element={
              <PrivateRoute>
                <MyListPage films={films} />
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
