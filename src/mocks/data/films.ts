import { faker } from '@faker-js/faker';
import { CardFilm, PromoFilm, PageFilm, FullFilm, Films } from '../../types/films';

const getMockStarring = () => Array.from(
  { length: faker.number.int({ min: 1, max: 8 }) },
  () => faker.person.fullName()
);

const getMockBaseFilm = () => ({
  id: crypto.randomUUID(),
  name: faker.book.title(),
  genre: faker.book.genre(),
});

export const getMockCardFilm = (preset: Partial<CardFilm> = {}): CardFilm => ({
  previewImage: faker.system.filePath(),
  previewVideoLink: faker.system.filePath(),
  ...getMockBaseFilm(),
  ...preset
});

export const getMockPromoFilm = (preset: Partial<PromoFilm> = {}): PromoFilm => ({
  posterImage: faker.system.filePath(),
  backgroundImage: faker.system.filePath(),
  videoLink: faker.system.filePath(),
  released: faker.number.int({ min: 2000, max: 2025 }),
  isFavorite: Boolean(faker.number.int({ max: 1 })),
  ...getMockBaseFilm(),
  ...preset
});

export const getMockPageFilm = (preset: Partial<PageFilm> = {}): PageFilm => ({
  backgroundColor: faker.color.rgb(),
  rating: faker.number.int({ max: 10 }),
  description: faker.lorem.paragraph(),
  scoresCount: faker.number.int({ max: 100 }),
  director: faker.book.author(),
  starring: getMockStarring(),
  runTime: faker.number.int({ min: 30, max: 120 }),
  ...getMockPromoFilm(),
  ...preset
});

export const getMockFullFilm = (preset: Partial<FullFilm> = {}): FullFilm => ({
  previewImage: faker.system.filePath(),
  previewVideoLink: faker.system.filePath(),
  ...getMockPageFilm(),
  ...preset
});

export const getMockFilms = (count: number, preset: Partial<CardFilm> = {}): Films =>
  Array.from({ length: count }, () => getMockCardFilm(preset));
