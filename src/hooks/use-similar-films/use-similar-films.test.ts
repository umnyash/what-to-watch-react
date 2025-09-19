import { renderHook } from '@testing-library/react';

import { getMockFilms } from '../../mocks/data';
import { withStoreWrapper } from '../../tests/render-helpers';
import { similarFilmsSelectors } from '../../store/similar-films/similar-films.selectors';

import { useSimilarFilms } from './use-similar-films';

vi.mock('../../store/similar-films/similar-films.selectors', () => ({
  similarFilmsSelectors: {
    filmId: vi.fn(),
    isLoading: vi.fn(),
    isLoaded: vi.fn(),
    isLoadFailed: vi.fn(),
    someRandomFilms: vi.fn(),
  }
}));

describe('Hook: useSimilarFilms', () => {
  const sourceFilm1Id = 'id1234';
  const sourceFilm2Id = 'id0000';
  const mockFilms = getMockFilms(2);
  const mockedSelectors = vi.mocked(similarFilmsSelectors);

  const { WithStoreWrapper } = withStoreWrapper();

  describe.each([
    [null, false, false, false, []],
    [sourceFilm1Id, true, false, false, []],
    [sourceFilm1Id, false, true, false, mockFilms],
    [sourceFilm1Id, false, false, true, []]
  ])('similar films selectors returned values', (filmId, isLoading, isLoaded, isLoadFailed, films) => {
    beforeEach(() => {
      mockedSelectors.filmId.mockReturnValue(filmId);
      mockedSelectors.isLoading.mockReturnValue(isLoading);
      mockedSelectors.isLoaded.mockReturnValue(isLoaded);
      mockedSelectors.isLoadFailed.mockReturnValue(isLoadFailed);
      mockedSelectors.someRandomFilms.mockReturnValue(films);
    });

    it('should return object with similar films selectors values when id argument matches filmId selector returned value', () => {
      const { result } = renderHook(
        () => useSimilarFilms(sourceFilm1Id),
        { wrapper: WithStoreWrapper }
      );

      expect(result.current).toEqual({
        data: films,
        isLoading,
        isLoaded,
        isLoadFailed,
      });
    });

    it('should return object with empty array data and false selectors when id argument mismatch filmId selector returned value', () => {
      const { result } = renderHook(
        () => useSimilarFilms(sourceFilm2Id),
        { wrapper: WithStoreWrapper }
      );

      expect(result.current).toEqual({
        data: [],
        isLoading: false,
        isLoaded: false,
        isLoadFailed: false,
      });
    });
  });
});
