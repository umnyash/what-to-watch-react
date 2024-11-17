import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppRoute } from '../../const';

import MainPage from '../../pages/main-page/main-page';
import LoginPage from '../../pages/login-page/login-page';
import FilmPage from '../../pages/film-page/film-page';
import MyListPage from '../../pages/my-list-page/my-list-page';
import ReviewPage from '../../pages/review-page/review-page';
import PlayerPage from '../../pages/player-page/player-page';
import NotFoundPage from '../../pages/not-found-page/not-found-page';

import { PromoFilm } from '../../types/promo-film';

type AppProps = {
  promoFilm: PromoFilm;
}

function App({ promoFilm }: AppProps): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={AppRoute.Root}
          element={<MainPage promoFilm={promoFilm} />}
        />
        <Route
          path={AppRoute.Login}
          element={<LoginPage />}
        />
        <Route
          path={AppRoute.Film}
          element={<FilmPage />}
        />
        <Route
          path={AppRoute.MyList}
          element={<MyListPage />}
        />
        <Route
          path={AppRoute.Review}
          element={<ReviewPage />}
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
  );
}

export default App;
