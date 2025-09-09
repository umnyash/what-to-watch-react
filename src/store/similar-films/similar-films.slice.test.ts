import { RequestStatus } from '../../const';
import { SimilarFilmsState } from '../../types/state';
import { getMockFilms } from '../../mocks/data';
import { fetchSimilarFilms } from '../async-actions';

import { similarFilmsSlice } from './similar-films.slice';

describe('Slice: similarFilms', () => {
  const mockFilms = getMockFilms(2);

  it('should return current state when action is unknown', () => {
    const expectedState: SimilarFilmsState = {
      filmId: 'some-film-id',
      loadingStatus: RequestStatus.Success,
      films: mockFilms,
    };
    const unknownAction = { type: '' };

    const result = similarFilmsSlice.reducer(expectedState, unknownAction);

    expect(result).toEqual(expectedState);
  });

  it('should return initial state when state is undefined and action is unknown', () => {
    const initialState: SimilarFilmsState = {
      filmId: null,
      loadingStatus: RequestStatus.Idle,
      films: [],
    };
    const unknownAction = { type: '' };

    const result = similarFilmsSlice.reducer(undefined, unknownAction);

    expect(result).toEqual(initialState);
  });

  describe('fetchSimilarFilms', () => {
    const sourceFilm1Id = 'id1';
    const sourceFilm2Id = 'id2';

    it.each([
      undefined,
      {
        filmId: sourceFilm1Id,
        loadingStatus: RequestStatus.Success,
        films: mockFilms,
      },
      {
        filmId: sourceFilm1Id,
        loadingStatus: RequestStatus.Error,
        films: [],
      },
    ])(`should set film ID, ${RequestStatus.Pending} loading status and clear previous films data if any existed on "fetchSimilarFilms.pending" action`,
      (initialState) => {
        const expectedState: SimilarFilmsState = {
          filmId: sourceFilm2Id,
          loadingStatus: RequestStatus.Pending,
          films: [],
        };

        const result = similarFilmsSlice.reducer(initialState, fetchSimilarFilms.pending(
          '', sourceFilm2Id
        ));

        expect(result).toEqual(expectedState);
      }
    );

    describe('fetchSimilarFilms.fulfilled', () => {
      it(`should set ${RequestStatus.Success} loading status and films data when film ID matches on "fetchSimilarFilms.fulfilled" action`, () => {
        const initialState: SimilarFilmsState = {
          filmId: sourceFilm2Id,
          loadingStatus: RequestStatus.Pending,
          films: [],
        };
        const expectedState: SimilarFilmsState = {
          ...initialState,
          loadingStatus: RequestStatus.Success,
          films: mockFilms,
        };

        const result = similarFilmsSlice.reducer(initialState, fetchSimilarFilms.fulfilled(
          mockFilms, '', sourceFilm2Id
        ));

        expect(result).toEqual(expectedState);
      });

      it('should ignore response when film ID mismatch on "fetchSimilarFilms.fulfilled" action', () => {
        const initialState: SimilarFilmsState = {
          filmId: sourceFilm2Id,
          loadingStatus: RequestStatus.Pending,
          films: [],
        };

        const result = similarFilmsSlice.reducer(initialState, fetchSimilarFilms.fulfilled(
          mockFilms, '', sourceFilm1Id
        ));

        expect(result).toEqual(initialState);
      });
    });

    describe('fetchSimilarFilms.rejected', () => {
      it(`should set ${RequestStatus.Error} loading status when film ID matches on "fetchSimilarFilms.rejected" action`, () => {
        const initialState: SimilarFilmsState = {
          filmId: sourceFilm2Id,
          loadingStatus: RequestStatus.Pending,
          films: [],
        };
        const expectedState: SimilarFilmsState = {
          ...initialState,
          loadingStatus: RequestStatus.Error,
        };

        const result = similarFilmsSlice.reducer(initialState, fetchSimilarFilms.rejected(
          null, '', sourceFilm2Id
        ));

        expect(result).toEqual(expectedState);
      });

      it('should ignore error when film ID mismatch on "fetchSimilarFilms.rejected" action (stale response)', () => {
        const initialState: SimilarFilmsState = {
          filmId: sourceFilm2Id,
          loadingStatus: RequestStatus.Pending,
          films: [],
        };

        const result = similarFilmsSlice.reducer(initialState, fetchSimilarFilms.rejected(
          null, '', sourceFilm1Id
        ));

        expect(result).toEqual(initialState);
      });
    });
  });
});
