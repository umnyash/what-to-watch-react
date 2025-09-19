import { renderHook } from '@testing-library/react';

import { getMockPageFilm, getMockPromoFilm } from '../../mocks/data';
import { withStoreWrapper } from '../../tests/render-helpers';
import { filmSelectors } from '../../store/film/film.selectors';
import { promoFilmSelectors } from '../../store/promo-film/promo-film.selectors';

import { useFilm } from './use-film';

vi.mock('../../store/promo-film/promo-film.selectors', () => ({
  promoFilmSelectors: {
    film: vi.fn(),
    isLoading: vi.fn(),
    isLoadFailed: vi.fn(),
    isLoaded: vi.fn(),
  }
}));

vi.mock('../../store/film/film.selectors', () => ({
  filmSelectors: {
    film: vi.fn(),
    id: vi.fn(),
    isLoading: vi.fn(),
    isLoaded: vi.fn(),
    isLoadFailed: vi.fn(),
    isNotFound: vi.fn(),
  }
}));

describe('Hook: useFilm', () => {
  const mockPromoFilm = getMockPromoFilm();
  const mockedPromoFilmSelectors = vi.mocked(promoFilmSelectors);
  const mockedFilmSelectors = vi.mocked(filmSelectors);
  const { WithStoreWrapper } = withStoreWrapper();

  it.each([
    [null, false, false, false],
    [null, true, false, false],
    [mockPromoFilm, false, true, false],
    [null, false, false, true],
  ])(
    'should return object with promo film selectors values when no id argument provided',
    (film, isLoading, isLoaded, isLoadFailed) => {
      mockedPromoFilmSelectors.film.mockReturnValue(film);
      mockedPromoFilmSelectors.isLoading.mockReturnValue(isLoading);
      mockedPromoFilmSelectors.isLoaded.mockReturnValue(isLoaded);
      mockedPromoFilmSelectors.isLoadFailed.mockReturnValue(isLoadFailed);

      const { result } = renderHook(
        () => useFilm(),
        { wrapper: WithStoreWrapper }
      );

      expect(result.current).toEqual({
        data: film,
        isLoading,
        isLoaded,
        isLoadFailed,
      });
    }
  );

  describe('when id argument is provided', () => {
    const id = 'abc';

    it('should return object with promo film data when isDetailed not provided and id matches promo film ID', () => {
      mockedPromoFilmSelectors.film.mockReturnValue(mockPromoFilm);

      const { result } = renderHook(
        () => useFilm(mockPromoFilm.id),
        { wrapper: WithStoreWrapper }
      );

      expect(result.current).toEqual({
        data: mockPromoFilm,
        isLoading: false,
        isLoaded: true,
        isLoadFailed: false,
      });
    });

    describe.each([
      [null, false, false, false, false],
      [null, true, false, false, false],
      [getMockPageFilm({ id }), false, true, false, false],
      [null, false, false, true, false],
      [null, false, false, true, true],
    ])(
      'describe combinations of values ​​returned by film selectors',
      (film, isLoading, isLoaded, isLoadFailed, isNotFound) => {
        beforeEach(() => {
          mockedFilmSelectors.id.mockReturnValue(id);
          mockedFilmSelectors.film.mockReturnValue(film);
          mockedFilmSelectors.isLoading.mockReturnValue(isLoading);
          mockedFilmSelectors.isLoaded.mockReturnValue(isLoaded);
          mockedFilmSelectors.isLoadFailed.mockReturnValue(isLoadFailed);
          mockedFilmSelectors.isNotFound.mockReturnValue(isNotFound);
        });

        describe('should return object with film selectors values', () => {
          const expectedObject = {
            data: film,
            isLoading,
            isLoaded,
            isLoadFailed,
            isNotFound,
          };

          it.each([
            null,
            mockPromoFilm,
          ])('when isDetailed not provided and id mismatch promo film ID', (promoFilm) => {
            mockedPromoFilmSelectors.film.mockReturnValue(promoFilm);

            const { result } = renderHook(
              () => useFilm(id),
              { wrapper: WithStoreWrapper }
            );

            expect(result.current).toEqual(expectedObject);
          });

          it.each([
            null,
            mockPromoFilm,
            getMockPromoFilm({ id })
          ])('when isDetailed is true (promo film data is ignored in any case)', (promoFilm) => {
            mockedPromoFilmSelectors.film.mockReturnValue(promoFilm);

            const { result } = renderHook(
              () => useFilm(id, true),
              { wrapper: WithStoreWrapper }
            );

            expect(result.current).toEqual(expectedObject);
          });
        });

        it('should return object with null data and false selectors when id selector returned value mismatch id argument', () => {
          const expectedObject = {
            data: null,
            isLoading: false,
            isLoaded: false,
            isLoadFailed: false,
            isNotFound: false,
          };

          const { result } = renderHook(
            () => useFilm('another-id', true),
            { wrapper: WithStoreWrapper }
          );

          expect(result.current).toEqual(expectedObject);
        });
      }
    );
  });
});
