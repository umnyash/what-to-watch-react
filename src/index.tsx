import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './components/app';
import { films } from './mocks/films';
import { reviews } from './mocks/reviews';
import { film } from './mocks/film';
import { store } from './store';
import { checkUserAuth } from './store/async-actions';

store.dispatch(checkUserAuth());

const promoFilm = {
  name: 'The Grand Budapest Hotel',
  genre: 'drama',
  released: 2014,
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App promoFilm={promoFilm} film={film} films={films} reviews={reviews} />
    </Provider>
  </React.StrictMode>
);
