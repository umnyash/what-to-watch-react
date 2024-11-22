import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app/app';
import { films } from './mocks/films';

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
    <App promoFilm={promoFilm} films={films} />
  </React.StrictMode>
);
