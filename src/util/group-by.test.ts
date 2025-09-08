import { Films } from '../types/films';
import { getMockFilms } from '../mocks/data';

import { groupBy } from './group-by';

describe('Function: groupBy', () => {
  enum MockGenre {
    Action = 'Action',
    Adventure = 'Adventure',
    Comedy = 'Comedy',
    Fantasy = 'Fantasy',
  }

  const FilmsCountByGenre = {
    [MockGenre.Action]: 1,
    [MockGenre.Adventure]: 2,
    [MockGenre.Comedy]: 3,
    [MockGenre.Fantasy]: 4,
  };

  const films = [
    ...getMockFilms(FilmsCountByGenre[MockGenre.Action], { genre: MockGenre.Action }),
    ...getMockFilms(FilmsCountByGenre[MockGenre.Adventure], { genre: MockGenre.Adventure }),
    ...getMockFilms(FilmsCountByGenre[MockGenre.Comedy], { genre: MockGenre.Comedy }),
    ...getMockFilms(FilmsCountByGenre[MockGenre.Fantasy], { genre: MockGenre.Fantasy }),
  ];

  const backupFilms = films.slice();
  const filmsGroupedByGenre = groupBy(films, (film) => film.genre);

  it('should not modify the original array', () => {
    expect(films).toEqual(backupFilms);
  });

  it('should return an object with 4 keys: "action", "adventure", "comedy", "fantasy"', () => {
    const expectedKeys = [MockGenre.Action, MockGenre.Adventure, MockGenre.Comedy, MockGenre.Fantasy];
    const resultKeys = Object.keys(filmsGroupedByGenre);

    expect(filmsGroupedByGenre).toBeInstanceOf(Object);
    expect(expectedKeys.length).toBe(resultKeys.length);
    expect(expectedKeys.sort()).toEqual(resultKeys.sort()); //////////////////////
  });

  it('should return correct number of elements for each key', () => {
    const actionFilmsCount = filmsGroupedByGenre[MockGenre.Action]!.length;
    const adventureFilmsCount = filmsGroupedByGenre[MockGenre.Adventure]!.length;
    const comedyFilmsCount = filmsGroupedByGenre[MockGenre.Comedy]!.length;
    const fantasyFilmsCount = filmsGroupedByGenre[MockGenre.Fantasy]!.length;

    expect(actionFilmsCount).toBe(FilmsCountByGenre[MockGenre.Action]);
    expect(adventureFilmsCount).toBe(FilmsCountByGenre[MockGenre.Adventure]);
    expect(comedyFilmsCount).toBe(FilmsCountByGenre[MockGenre.Comedy]);
    expect(fantasyFilmsCount).toBe(FilmsCountByGenre[MockGenre.Fantasy]);
  });

  it('should return an empty object if the array was empty', () => {
    const emptyFilmsArray: Films = [];
    const expectedObject = {};

    const result = groupBy(emptyFilmsArray, (film) => film.genre);

    expect(result).toEqual(expectedObject);
  });

  it('should work with Set collections', () => {
    const filmsSet = new Set(films);

    const result = groupBy(filmsSet, (film) => film.genre);

    expect(result).toEqual(filmsGroupedByGenre);
  });
});
