import { PageFilm } from '../types/films';

export const film: PageFilm = {
  id: crypto.randomUUID(),
  name: 'The Grand Budapest Hotel',
  posterImage: 'img/the-grand-budapest-hotel-poster.jpg',
  backgroundImage: 'img/bg-the-grand-budapest-hotel.jpg',
  backgroundColor: '#ffffff',
  videoLink: 'https://16.design.htmlacademy.pro/static//film/video/dog.mp4',
  description: 'In the 1930s, the Grand Budapest Hotel is a popular European ski resort, presided over by concierge Gustave H. (Ralph Fiennes). Zero, a junior lobby boy, becomes Gustave\'s friend and protege.',
  rating: 8.9,
  scoresCount: 240,
  director: 'Wes Anderson',
  starring: ['Bill Murray', 'Edward Norton', 'Jude Law', 'Willem Dafoe and other'],
  runTime: 99,
  genre: 'Comedy',
  released: 2014,
  isFavorite: false
};
