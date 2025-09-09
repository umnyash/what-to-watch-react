import { ERROR_PLACEHOLDER_MESSAGE, RequestStatus } from '../../const';
import { FilmState } from '../../types/state';
import { UNEXPECTED_ERROR, FavoriteStatus } from '../../services/api';
import { getMockPageFilm, getMockFullFilm, getMockCardFilm, getMockFilms, getMockReview } from '../../mocks/data';
import { fetchFilm, changeFavoriteStatus, logoutUser, fetchFavorites, submitReview } from '../async-actions';

import { filmSlice } from './film.slice';

describe('Slice: film', () => {
  const mockCurrentFilm = getMockPageFilm();
  const mockRequestedFilm1 = getMockPageFilm();
  const mockRequestedFilm2 = getMockPageFilm();

  it('should return current state when action is unknown', () => {
    const expectedState: FilmState = {
      id: mockCurrentFilm.id,
      loadingStatus: RequestStatus.Success,
      film: mockCurrentFilm,
      error: null,
    };
    const unknownAction = { type: '' };

    const result = filmSlice.reducer(expectedState, unknownAction);

    expect(result).toEqual(expectedState);
  });

  it('should return initial state when state is undefined and action is unknown', () => {
    const initialState: FilmState = {
      id: null,
      loadingStatus: RequestStatus.Idle,
      film: null,
      error: null,
    };
    const unknownAction = { type: '' };

    const result = filmSlice.reducer(undefined, unknownAction);

    expect(result).toEqual(initialState);
  });

  describe('fetchFilm', () => {
    it.each([
      undefined,
      {
        id: mockCurrentFilm.id,
        loadingStatus: RequestStatus.Success,
        film: mockCurrentFilm,
        error: null,
      },
      {
        id: mockRequestedFilm1.id,
        loadingStatus: RequestStatus.Error,
        film: null,
        error: ERROR_PLACEHOLDER_MESSAGE,
      }
    ])(`should set ID of requested film and "${RequestStatus.Pending}" loading status and clear previous data if any existed on "fetchFilm.pending" action`, (initialState) => {
      const expectedState: FilmState = {
        id: mockRequestedFilm2.id,
        loadingStatus: RequestStatus.Pending,
        film: null,
        error: null,
      };

      const result = filmSlice.reducer(initialState, fetchFilm.pending('', mockRequestedFilm2.id));

      expect(result).toEqual(expectedState);
    });

    describe('fetchFilm.fulfilled', () => {
      it(`should set film data and "${RequestStatus.Success}" loading status when response matches last requested film ID on "fetchFilm.fulfilled" action`, () => {
        const initialState: FilmState = {
          id: mockRequestedFilm2.id,
          loadingStatus: RequestStatus.Pending,
          film: null,
          error: null,
        };
        const expectedState: FilmState = {
          ...initialState,
          film: mockRequestedFilm2,
          loadingStatus: RequestStatus.Success,
        };

        const result = filmSlice.reducer(initialState, fetchFilm.fulfilled(
          mockRequestedFilm2, '', mockRequestedFilm2.id
        ));

        expect(result).toEqual(expectedState);
      });

      it('should ignore response if film ID does not match last requested film ID on "fetchFilm.fulfilled" action (stale response)', () => {
        const initialState: FilmState = {
          id: mockRequestedFilm2.id,
          loadingStatus: RequestStatus.Pending,
          film: null,
          error: null,
        };

        const result = filmSlice.reducer(initialState, fetchFilm.fulfilled(
          mockRequestedFilm1, '', mockRequestedFilm1.id
        ));

        expect(result).toEqual(initialState);
      });
    });

    describe('fetchFilm.rejected', () => {
      it.each([
        ['error data from payload', UNEXPECTED_ERROR],
        ['fallback error message when no payload', undefined]
      ])(
        `should set "${RequestStatus.Error}" loading status and %s when response matches last requested film ID on "fetchFilm.rejected" action`,
        (_error, payload) => {
          const initialState: FilmState = {
            id: mockRequestedFilm2.id,
            loadingStatus: RequestStatus.Pending,
            film: null,
            error: null,
          };
          const expectedState: FilmState = {
            id: mockRequestedFilm2.id,
            loadingStatus: RequestStatus.Error,
            film: null,
            error: payload ?? ERROR_PLACEHOLDER_MESSAGE,
          };

          const result = filmSlice.reducer(initialState, fetchFilm.rejected(
            null, '', mockRequestedFilm2.id, payload
          ));

          expect(result).toEqual(expectedState);
        }
      );

      it('should ignore error if film ID does not match last requested film ID on "fetchFilm.rejected" action (stale response)', () => {
        const initialState: FilmState = {
          id: mockRequestedFilm2.id,
          loadingStatus: RequestStatus.Pending,
          film: null,
          error: null,
        };

        const result = filmSlice.reducer(initialState, fetchFilm.rejected(
          null, '', mockRequestedFilm1.id
        ));

        expect(result).toEqual(initialState);
      });
    });
  });

  describe('film data loaded', () => {
    describe('fetchFavorites', () => {
      it.each([
        {
          description: 'set favorites status to true if film is in favorites',
          favorites: [getMockCardFilm({ id: mockCurrentFilm.id })],
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
          const initialState: FilmState = {
            id: mockCurrentFilm.id,
            loadingStatus: RequestStatus.Success,
            film: { ...mockCurrentFilm, isFavorite: false },
            error: null,
          };
          const expectedState: FilmState = {
            ...initialState,
            film: { ...mockCurrentFilm, isFavorite: Boolean(filmUpdatedFavoriteStatus) }
          };

          const result = filmSlice.reducer(initialState, fetchFavorites.fulfilled(
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
          const initialState: FilmState = {
            id: mockCurrentFilm.id,
            loadingStatus: RequestStatus.Success,
            film: { ...mockCurrentFilm, isFavorite: currentFavoriteStatus },
            error: null,
          };
          const mockChangedFilm = getMockFullFilm({ ...mockCurrentFilm, isFavorite: newFavoriteStatus });
          const expectedState: FilmState = {
            ...initialState,
            film: { ...mockCurrentFilm, isFavorite: newFavoriteStatus },
          };

          const result = filmSlice.reducer(initialState, changeFavoriteStatus.fulfilled(
            mockChangedFilm, '', { filmId: mockCurrentFilm.id, status: newFavoriteStatus ? FavoriteStatus.On : FavoriteStatus.Off }
          ));

          expect(result).toEqual(expectedState);
        }
      );

      it.each([false, true])(
        'should not change film favorite status if film ID not matches on "changeFavoriteStatus.fulfilled" action',
        (newFavoriteStatus) => {
          const initialState: FilmState = {
            id: mockCurrentFilm.id,
            loadingStatus: RequestStatus.Success,
            film: mockCurrentFilm,
            error: null,
          };
          const mockChangedFilm = getMockFullFilm({ isFavorite: newFavoriteStatus });

          const result = filmSlice.reducer(initialState, changeFavoriteStatus.fulfilled(
            mockChangedFilm, '', { filmId: mockChangedFilm.id, status: newFavoriteStatus ? FavoriteStatus.On : FavoriteStatus.Off }
          ));

          expect(result).toEqual(initialState);
        }
      );
    });

    describe('submitReview', () => {
      it.each([
        [0, 0, 10, 10],
        [10, 1, 10, 10],
        [10, 1, 1, 5.5],
        [10, 9, 1, 9.1],
      ])(
        'should update film rating and increase scoresCount by 1 if film ID matches on "submitReview.fulfilled" action',
        (rating, scoresCount, reviewRating, newRating) => {
          const initialState: FilmState = {
            id: mockCurrentFilm.id,
            loadingStatus: RequestStatus.Success,
            film: { ...mockCurrentFilm, rating, scoresCount },
            error: null,
          };
          const expectedState: FilmState = {
            id: mockCurrentFilm.id,
            loadingStatus: RequestStatus.Success,
            film: { ...mockCurrentFilm, rating: newRating, scoresCount: scoresCount + 1 },
            error: null,
          };
          const newMockReview = getMockReview({ rating: reviewRating });
          const newMockReviewContent = { rating: newMockReview.rating, comment: newMockReview.comment };

          const result = filmSlice.reducer(initialState, submitReview.fulfilled(
            newMockReview, '', { filmId: mockCurrentFilm.id, content: newMockReviewContent }
          ));

          expect(result).toEqual(expectedState);
        }
      );

      it('should not change film rating and scoresCount if film ID not matches on "submitReview.fulfilled" action', () => {
        const initialState: FilmState = {
          id: mockCurrentFilm.id,
          loadingStatus: RequestStatus.Success,
          film: mockCurrentFilm,
          error: null,
        };
        const newMockReview = getMockReview();
        const newMockReviewContent = { rating: newMockReview.rating, comment: newMockReview.comment };
        const mockAnotherFilmId = 'another-film-id';

        const result = filmSlice.reducer(initialState, submitReview.fulfilled(
          newMockReview, '', { filmId: mockAnotherFilmId, content: newMockReviewContent }
        ));

        expect(result).toEqual(initialState);
      });
    });

    describe('logoutUser', () => {
      it.each([false, true])(
        'should set favorites (%s) status to false on "logoutUser.fulfilled" action',
        (currentFavoriteStatus) => {
          const initialState: FilmState = {
            id: mockCurrentFilm.id,
            loadingStatus: RequestStatus.Success,
            film: { ...mockCurrentFilm, isFavorite: currentFavoriteStatus },
            error: null,
          };
          const expectedState: FilmState = {
            ...initialState,
            film: { ...mockCurrentFilm, isFavorite: false }
          };

          const result = filmSlice.reducer(initialState, logoutUser.fulfilled);

          expect(result).toEqual(expectedState);
        }
      );
    });
  });

  describe('no film data', () => {
    it.each([
      {
        id: null,
        loadingStatus: RequestStatus.Idle,
        film: null,
        error: null,
      },
      {
        id: mockRequestedFilm1.id,
        loadingStatus: RequestStatus.Error,
        film: null,
        error: ERROR_PLACEHOLDER_MESSAGE,
      }
    ])(
      'should not throw an error if no film data on "fetchFavorites.fulfilled", "changeFavoriteStatus.fulfilled", "submitReview.fulfilled" or "logoutUser.fulfilled" actions',
      (initialState) => {
        const favorites = getMockFilms(2);
        const mockChangedFilm = getMockFullFilm({ isFavorite: true });
        const newMockReview = getMockReview();
        const newMockReviewContent = { rating: newMockReview.rating, comment: newMockReview.comment };
        let result: FilmState;

        result = filmSlice.reducer(initialState, fetchFavorites.fulfilled(
          favorites, '', undefined
        ));
        result = filmSlice.reducer(result, changeFavoriteStatus.fulfilled(
          mockChangedFilm, '', { filmId: mockChangedFilm.id, status: FavoriteStatus.On }
        ));
        result = filmSlice.reducer(initialState, submitReview.fulfilled(
          newMockReview, '', { filmId: mockChangedFilm.id, content: newMockReviewContent }
        ));
        result = filmSlice.reducer(result, logoutUser.fulfilled);

        expect(result).toEqual(initialState);
      }
    );
  });
});
