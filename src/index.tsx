import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app';
import { films } from './mocks/films';
import { reviews } from './mocks/reviews';
import { film } from './mocks/film';

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
    <App promoFilm={promoFilm} film={film} films={films} reviews={reviews} />
  </React.StrictMode>
);
