import { RequestStatus, SliceName, SIMILAR_FILMS_MAX_COUNT } from '../../const';
import { State } from '../../types/state';
import { getMockFilms } from '../../mocks/data';

import { similarFilmsSelectors } from './similar-films.selectors';
import { Films } from '../../types/films';

const createState = (films: Films): Pick<State, SliceName.SimilarFilms> => ({
  [SliceName.SimilarFilms]: {
    filmId: 'some-film-id',
    loadingStatus: RequestStatus.Success,
    films,
  }
});

describe('Selectors: similarFilms', () => {
  const sliceName = SliceName.SimilarFilms;
  const mockSimilarFilms = getMockFilms(SIMILAR_FILMS_MAX_COUNT * 2);

  describe('Simple selectors', () => {
    const state = createState(mockSimilarFilms);

    it('should return film ID from state', () => {
      const { filmId } = state[sliceName];
      const result = similarFilmsSelectors.filmId(state);
      expect(result).toBe(filmId);
    });

    it.each([
      [RequestStatus.Idle, false, false, false],
      [RequestStatus.Pending, true, false, false],
      [RequestStatus.Success, false, true, false],
      [RequestStatus.Error, false, false, true],
    ])(
      'when loading status is %s – isLoading → %s, isLoaded → %s, isLoadFailded → %s',
      (loadingStatus, expectedIsLoadingValue, expectedIsLoadedValue, expectedIsLoadFailedValue) => {
        state[sliceName].loadingStatus = loadingStatus;

        expect(similarFilmsSelectors.isLoading(state)).toBe(expectedIsLoadingValue);
        expect(similarFilmsSelectors.isLoaded(state)).toBe(expectedIsLoadedValue);
        expect(similarFilmsSelectors.isLoadFailed(state)).toBe(expectedIsLoadFailedValue);
      }
    );
  });

  describe('someRandomFilms', () => {
    it.each([
      [[]],
      [mockSimilarFilms.slice(0, SIMILAR_FILMS_MAX_COUNT - 2)],
      [mockSimilarFilms.slice(0, SIMILAR_FILMS_MAX_COUNT)],
    ])(
      `should return all films if there are less than ${SIMILAR_FILMS_MAX_COUNT}`, (allSimilarFilms) => {
        const state = createState(allSimilarFilms);

        const result = similarFilmsSelectors.someRandomFilms(state);

        expect(result).toHaveLength(allSimilarFilms.length);
        expect(result).toEqual(expect.arrayContaining(allSimilarFilms));
      }
    );

    it(`should return up to ${SIMILAR_FILMS_MAX_COUNT} films`, () => {
      const state = createState(mockSimilarFilms);
      const result = similarFilmsSelectors.someRandomFilms(state);
      expect(result.length).toBeLessThanOrEqual(SIMILAR_FILMS_MAX_COUNT);
    });

    it(`should return ${SIMILAR_FILMS_MAX_COUNT} unique random films`, () => {
      const results = Array.from({ length: 3 }, () => {
        const state = createState([...mockSimilarFilms]);

        return similarFilmsSelectors.someRandomFilms(state);
      });
      const [result1, result2, result3] = results;

      results.forEach((result) => {
        const uniqueIds = new Set(result.map((film) => film.id));
        expect(uniqueIds).toHaveLength(SIMILAR_FILMS_MAX_COUNT);
      });

      expect(result1).not.toEqual(result2);
      expect(result1).not.toEqual(result3);
      expect(result2).not.toEqual(result3);
    });
  });
});
