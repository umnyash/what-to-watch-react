import MainPage from '../../pages/main-page/main-page';
import { PromoFilm } from '../../types/promo-film';

type AppProps = {
  promoFilm: PromoFilm;
}

function App({ promoFilm }: AppProps): JSX.Element {
  return (
    <MainPage promoFilm={promoFilm} />
  );
}

export default App;
