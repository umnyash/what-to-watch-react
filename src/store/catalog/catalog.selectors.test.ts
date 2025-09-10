import { SliceName, RequestStatus, FILMS_PER_LOAD, GENRES_MAX_COUNT } from '../../const';
import { State } from '../../types/state';
import { catalogSelectors } from './catalog.selectors';
import { getMockCardFilm, getMockFilms, MockGenre, getMockUniqueGenres } from '../../mocks/data';

describe('Selectors: catalog', () => {
  const sliceName = SliceName.Catalog;
  let state: Pick<State, SliceName.Catalog>;

  beforeEach(() => {
    state = {
      [sliceName]: {
        films: [],
        filmsLoadingStatus: RequestStatus.Idle,
        filter: {
          genre: null,
        },
        displayedFilmsMaxCount: FILMS_PER_LOAD,
      }
    };
  });

  it.each([
    [RequestStatus.Idle, false, false, false],
    [RequestStatus.Pending, true, false, false],
    [RequestStatus.Success, false, true, false],
    [RequestStatus.Error, false, false, true],
  ])(
    'when films loading status is %s – isFilmsLoading → %s, isFilmsLoaded → %s, isFilmsLoadFailded → %s',
    (filmsLoadingStatus, expectedIsLoadingValue, expectedIsLoadedValue, expectedIsLoadFailedValue) => {
      state[sliceName].filmsLoadingStatus = filmsLoadingStatus;

      expect(catalogSelectors.isFilmsLoading(state)).toBe(expectedIsLoadingValue);
      expect(catalogSelectors.isFilmsLoaded(state)).toBe(expectedIsLoadedValue);
      expect(catalogSelectors.isFilmsLoadFailed(state)).toBe(expectedIsLoadFailedValue);
    }
  );

  it('should return genre filter from state', () => {
    const { filter: { genre } } = state[sliceName];
    const result = catalogSelectors.genreFilter(state);
    expect(genre).toBe(result);
  });

  describe('displayedFilms', () => {
    const comedies = getMockFilms(3, { genre: MockGenre.Comedy });
    const adventures = getMockFilms(3, { genre: MockGenre.Adventure });
    const animations = getMockFilms(3, { genre: MockGenre.Animation });
    const mockFilms = [...comedies, ...adventures, ...animations];

    beforeEach(() => {
      state[sliceName].films = mockFilms;
    });

    describe('filter by genre', () => {
      beforeEach(() => {
        state[sliceName].displayedFilmsMaxCount = mockFilms.length;
      });

      it('should return all films when genre filter is null', () => {
        const result = catalogSelectors.displayedFilms(state);
        expect(result).toEqual(mockFilms);
      });

      it.each([
        [MockGenre.Comedy, comedies],
        [MockGenre.Adventure, adventures],
        [MockGenre.Animation, animations],
      ])('should retrun films of "%s" genre with the same genre filter value', (genre, films) => {
        state[sliceName].filter.genre = genre;
        const result = catalogSelectors.displayedFilms(state);
        expect(result).toEqual(films);
      });
    });

    describe('limitation on the number of films', () => {
      it.each([
        [0, 0, null],
        [5, 5, null],
        [mockFilms.length, mockFilms.length, null],
        [mockFilms.length, mockFilms.length + 3, null],
        [1, 1, MockGenre.Comedy],
        [comedies.length, comedies.length, MockGenre.Comedy],
        [comedies.length, comedies.length + 2, MockGenre.Comedy],
      ])('should return %i films', (expectedCount, maxCount, genre) => {
        state[sliceName].filter.genre = genre;
        state[sliceName].displayedFilmsMaxCount = maxCount;

        const result = catalogSelectors.displayedFilms(state);

        expect(result.length).toBe(expectedCount);
        expect(result.length).toBeLessThanOrEqual(maxCount);
      });
    });
  });

  describe('hasMoreFilms', () => {
    const mockFilmsGenre = MockGenre.Comedy;
    const mockFilms = getMockFilms(3, { genre: mockFilmsGenre });

    it.each([
      {
        case: 'should return true when genre is null and displayedFilmsMaxCount value less than films count',
        genre: null,
        maxCount: mockFilms.length - 1,
        expected: true,
      },
      {
        case: 'should return false when genre is null and displayedFilmsMaxCount value equals films count',
        genre: null,
        maxCount: mockFilms.length,
        expected: false,
      },
      {
        case: 'should return false when genre is null and displayedFilmsMaxCount greater than films count',
        genre: null,
        maxCount: mockFilms.length + 1,
        expected: false,
      },
      {
        case: 'should return true when genre is selected displayedFilmsMaxCount value less than filtered films count',
        genre: mockFilmsGenre,
        maxCount: mockFilms.length - 1,
        expected: true,
      },
      {
        case: 'should return false when genre is selected and displayedFilmsMaxCount value equals filtered films count',
        genre: mockFilmsGenre,
        maxCount: mockFilms.length,
        expected: false,
      },
      {
        case: 'should return false when genre is selected and displayedFilmsMaxCount greater than filtered films count',
        genre: mockFilmsGenre,
        maxCount: mockFilms.length + 1,
        expected: false,
      },
    ])('$case', ({ genre, maxCount, expected }) => {
      state[sliceName].filter.genre = genre;
      state[sliceName].displayedFilmsMaxCount = maxCount;
      state[sliceName].films = mockFilms;

      const result = catalogSelectors.hasMoreFilms(state);

      expect(result).toBe(expected);
    });
  });

  describe('topGenres', () => {
    it('should return genre strings array', () => {
      state[sliceName].films = getMockFilms(3);

      const result = catalogSelectors.topGenres(state);

      expect(result).toBeInstanceOf(Array);
      result.forEach((genre) => {
        expect(genre).toBeTypeOf('string');
      });
    });

    describe('sorting', () => {
      const expectedGenres = [MockGenre.Comedy, MockGenre.Adventure, MockGenre.Animation];
      const comedies = getMockFilms(3, { genre: MockGenre.Comedy });
      const adventures = getMockFilms(2, { genre: MockGenre.Adventure });
      const animations = getMockFilms(1, { genre: MockGenre.Animation });

      it.each([
        [[...comedies, ...adventures, ...animations]],
        [[...adventures, ...animations, ...comedies]],
        [[...animations, ...adventures, ...comedies]],
      ])('should sort genres by related films count', (films) => {
        state[sliceName].films = films;
        const result = catalogSelectors.topGenres(state);
        expect(result).toEqual(expectedGenres);
      });
    });

    describe('max count', () => {
      const manyFilmsOfUniqueGenres = getMockUniqueGenres(GENRES_MAX_COUNT + 1)
        .map((genre) => getMockCardFilm({ genre }));

      it.each([
        [manyFilmsOfUniqueGenres],
        [manyFilmsOfUniqueGenres.slice(0, GENRES_MAX_COUNT)],
        [manyFilmsOfUniqueGenres.slice(0, GENRES_MAX_COUNT - 1)],
      ])(`should return no more than ${GENRES_MAX_COUNT} genres`, (films) => {
        state[sliceName].films = films;
        const result = catalogSelectors.topGenres(state);
        expect(result.length).toBeLessThanOrEqual(GENRES_MAX_COUNT);
      });
    });
  });
});
