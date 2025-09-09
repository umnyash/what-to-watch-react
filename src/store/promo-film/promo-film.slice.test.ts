import { RequestStatus } from '../../const';
import { PromoFilmState } from '../../types/state';
import { FavoriteStatus } from '../../services/api';
import { getMockPromoFilm, getMockFullFilm, getMockCardFilm, getMockFilms } from '../../mocks/data';
import { fetchPromoFilm, changeFavoriteStatus, logoutUser, fetchFavorites } from '../async-actions';

import { promoFilmSlice } from './promo-film.slice';

describe('Slice: promoFilm', () => {
  const mockFilm = getMockPromoFilm();

  it('should return current state when action is unknown', () => {
    const expectedState: PromoFilmState = {
      film: mockFilm,
      loadingStatus: RequestStatus.Success,
    };
    const unknownAction = { type: '' };

    const result = promoFilmSlice.reducer(expectedState, unknownAction);

    expect(result).toEqual(expectedState);
  });

  it('should return initial state when state is undefined and action is unknown', () => {
    const initialState: PromoFilmState = {
      film: null,
      loadingStatus: RequestStatus.Idle,
    };
    const unknownAction = { type: '' };

    const result = promoFilmSlice.reducer(undefined, unknownAction);

    expect(result).toEqual(initialState);
  });

  describe('fetchPromoFilm', () => {
    it(`should set "${RequestStatus.Pending}" loading status on "fetchPromoFilm.pending" action`, () => {
      const expectedState: PromoFilmState = {
        film: null,
        loadingStatus: RequestStatus.Pending,
      };

      const result = promoFilmSlice.reducer(undefined, fetchPromoFilm.pending);

      expect(result).toEqual(expectedState);
    });

    it(`should set film data and "${RequestStatus.Success}" loading status on "fetchPromoFilm.fulfilled" action`, () => {
      const initialState: PromoFilmState = {
        film: null,
        loadingStatus: RequestStatus.Pending,
      };
      const expectedState: PromoFilmState = {
        film: mockFilm,
        loadingStatus: RequestStatus.Success,
      };

      const result = promoFilmSlice.reducer(initialState, fetchPromoFilm.fulfilled(
        mockFilm, '', undefined
      ));

      expect(result).toEqual(expectedState);
    });

    it(`should set "${RequestStatus.Error}" loading status on "fetchPromoFilm.rejected" action`, () => {
      const initialState: PromoFilmState = {
        film: null,
        loadingStatus: RequestStatus.Pending,
      };
      const expectedState: PromoFilmState = {
        ...initialState,
        loadingStatus: RequestStatus.Error,
      };

      const result = promoFilmSlice.reducer(initialState, fetchPromoFilm.rejected);

      expect(result).toEqual(expectedState);
    });
  });

  describe('film data loaded', () => {
    describe('fetchFavorites', () => {
      it.each([
        {
          description: 'set favorites status to true if film is in favorites',
          favorites: [getMockCardFilm({ id: mockFilm.id })],
          filmUpdatedFavoriteStatus: true,
        },
        {
          description: 'not change favorite status if film is not in favorites',
          favorites: [getMockCardFilm()],
        },
        {
          description: 'not change favorite status if favorites empty',
          favorites: [],
        }
      ])(
        'should $description on "fetchFavorites.fulfilled" action',
        ({ favorites, filmUpdatedFavoriteStatus }) => {
          const initialState: PromoFilmState = {
            film: { ...mockFilm, isFavorite: false },
            loadingStatus: RequestStatus.Success,
          };
          const expectedState: PromoFilmState = {
            ...initialState,
            film: { ...mockFilm, isFavorite: Boolean(filmUpdatedFavoriteStatus) }
          };

          const result = promoFilmSlice.reducer(initialState, fetchFavorites.fulfilled(
            favorites, '', undefined
          ));

          expect(result).toEqual(expectedState);
        }
      );
    });

    describe('changeFavoriteStatus', () => {
      it.each([
        [false, true],
        [true, false]
      ])(
        'should change film favorite (%s) status to %s if film ID matches on "changeFavoriteStatus.fulfilled" action',
        (currentFavoriteStatus, newFavoriteStatus) => {
          const initialState: PromoFilmState = {
            film: { ...mockFilm, isFavorite: currentFavoriteStatus },
            loadingStatus: RequestStatus.Success,
          };
          const mockChangedFilm = getMockFullFilm({ ...mockFilm, isFavorite: newFavoriteStatus });
          const expectedState: PromoFilmState = {
            ...initialState,
            film: { ...mockFilm, isFavorite: newFavoriteStatus },
          };

          const result = promoFilmSlice.reducer(initialState, changeFavoriteStatus.fulfilled(
            mockChangedFilm, '', { filmId: mockFilm.id, status: newFavoriteStatus ? FavoriteStatus.On : FavoriteStatus.Off }
          ));

          expect(result).toEqual(expectedState);
        }
      );

      it.each([false, true])(
        'should not change film favorite status if film ID not matches on "changeFavoriteStatus.fulfilled" action',
        (newFavoriteStatus) => {
          const initialState: PromoFilmState = {
            film: mockFilm,
            loadingStatus: RequestStatus.Success,
          };
          const mockChangedFilm = getMockFullFilm({ isFavorite: newFavoriteStatus });

          const result = promoFilmSlice.reducer(initialState, changeFavoriteStatus.fulfilled(
            mockChangedFilm, '', { filmId: mockChangedFilm.id, status: newFavoriteStatus ? FavoriteStatus.On : FavoriteStatus.Off }
          ));

          expect(result).toEqual(initialState);
        }
      );
    });

    describe('logoutUser', () => {
      it.each([false, true])(
        'should set favorites (%s) status to false on "logoutUser.fulfilled" action',
        (currentFavoriteStatus) => {
          const initialState: PromoFilmState = {
            film: { ...mockFilm, isFavorite: currentFavoriteStatus },
            loadingStatus: RequestStatus.Success,
          };
          const expectedState: PromoFilmState = {
            ...initialState,
            film: { ...mockFilm, isFavorite: false }
          };

          const result = promoFilmSlice.reducer(initialState, logoutUser.fulfilled);

          expect(result).toEqual(expectedState);
        }
      );
    });
  });

  describe('no film data', () => {
    it.each([
      {
        film: null,
        loadingStatus: RequestStatus.Idle,
      },
      {
        film: null,
        loadingStatus: RequestStatus.Error,
      }
    ])(
      'should not throw an error if no film data on "fetchFavorites.fulfilled", "changeFavoriteStatus.fulfilled" or "logoutUser.fulfilled" actions',
      (initialState) => {
        const favorites = getMockFilms(2);
        const mockChangedFilm = getMockFullFilm({ isFavorite: true });
        let result: PromoFilmState;

        result = promoFilmSlice.reducer(initialState, fetchFavorites.fulfilled(
          favorites, '', undefined
        ));
        result = promoFilmSlice.reducer(result, changeFavoriteStatus.fulfilled(
          mockChangedFilm, '', { filmId: mockChangedFilm.id, status: FavoriteStatus.On }
        ));
        result = promoFilmSlice.reducer(result, logoutUser.fulfilled);

        expect(result).toEqual(initialState);
      }
    );
  });
});
