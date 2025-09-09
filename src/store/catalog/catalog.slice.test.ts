import { FILMS_PER_LOAD, RequestStatus } from '../../const';
import { CatalogState } from '../../types/state';
import { getMockFilms } from '../../mocks/data';
import { fetchFilms } from '../async-actions';

import { catalogSlice, catalogActions } from './catalog.slice';

describe('Slice: catalog', () => {
  const unknownAction = { type: '' };
  const mockFilms = getMockFilms(2);

  it('should return current state when action is unknown', () => {
    const expectedState: CatalogState = {
      films: mockFilms,
      filmsLoadingStatus: RequestStatus.Success,
      filter: {
        genre: 'fantasy',
      },
      displayedFilmsMaxCount: FILMS_PER_LOAD * 2,
    };

    const result = catalogSlice.reducer(expectedState, unknownAction);

    expect(result).toEqual(expectedState);
  });

  it('should return initial state when state is undefined and action is unknown', () => {
    const initialState: CatalogState = {
      films: [],
      filmsLoadingStatus: RequestStatus.Idle,
      filter: {
        genre: null,
      },
      displayedFilmsMaxCount: FILMS_PER_LOAD,
    };

    const result = catalogSlice.reducer(undefined, unknownAction);

    expect(result).toEqual(initialState);
  });

  it('should set genre filter on "setGenreFilter" action', () => {
    const someGenre = 'comedy';
    const expectedState: CatalogState = {
      films: [],
      filmsLoadingStatus: RequestStatus.Idle,
      filter: {
        genre: someGenre,
      },
      displayedFilmsMaxCount: FILMS_PER_LOAD,
    };

    const result = catalogSlice.reducer(undefined, catalogActions.setGenreFilter(someGenre));

    expect(result).toEqual(expectedState);
  });

  describe('displayed films max count', () => {
    it('should increase displayed films max count on "increaseDisplayedFilmsMaxCount" action', () => {
      const expectedState: CatalogState = {
        films: [],
        filmsLoadingStatus: RequestStatus.Idle,
        filter: {
          genre: null,
        },
        displayedFilmsMaxCount: FILMS_PER_LOAD + FILMS_PER_LOAD,
      };

      const result = catalogSlice.reducer(undefined, catalogActions.increaseDisplayedFilmsMaxCount);

      expect(result).toEqual(expectedState);
    });

    it('should reset displayed films max count on "resetDisplayedFilmsMaxCount" action', () => {
      const initialState: CatalogState = {
        films: [],
        filmsLoadingStatus: RequestStatus.Idle,
        filter: {
          genre: null,
        },
        displayedFilmsMaxCount: FILMS_PER_LOAD * 4,
      };
      const expectedState: CatalogState = {
        films: [],
        filmsLoadingStatus: RequestStatus.Idle,
        filter: {
          genre: null,
        },
        displayedFilmsMaxCount: FILMS_PER_LOAD,
      };

      const result = catalogSlice.reducer(initialState, catalogActions.resetDisplayedFilmsMaxCount);

      expect(result).toEqual(expectedState);
    });
  });

  describe('fetchFilms', () => {
    it(`should set "${RequestStatus.Pending}" films loading status on "fetchFilms.pending" action`, () => {
      const expectedState: CatalogState = {
        films: [],
        filmsLoadingStatus: RequestStatus.Pending,
        filter: {
          genre: null,
        },
        displayedFilmsMaxCount: FILMS_PER_LOAD,
      };

      const result = catalogSlice.reducer(undefined, fetchFilms.pending);

      expect(result).toEqual(expectedState);
    });

    it(`should set films data and "${RequestStatus.Success}" films loading status on "fetchFilms.fulfilled" action`, () => {
      const initialState: CatalogState = {
        films: [],
        filmsLoadingStatus: RequestStatus.Pending,
        filter: {
          genre: null,
        },
        displayedFilmsMaxCount: FILMS_PER_LOAD,
      };
      const expectedState: CatalogState = {
        ...initialState,
        films: mockFilms,
        filmsLoadingStatus: RequestStatus.Success,
      };

      const result = catalogSlice.reducer(initialState, fetchFilms.fulfilled(
        mockFilms, '', undefined
      ));

      expect(result).toEqual(expectedState);
    });

    it(`should set "${RequestStatus.Error}" films loading status on "fetchFilms.rejected" action`, () => {
      const initialState: CatalogState = {
        films: [],
        filmsLoadingStatus: RequestStatus.Pending,
        filter: {
          genre: null,
        },
        displayedFilmsMaxCount: FILMS_PER_LOAD,
      };
      const expectedState: CatalogState = {
        ...initialState,
        filmsLoadingStatus: RequestStatus.Error,
      };

      const result = catalogSlice.reducer(initialState, fetchFilms.rejected);

      expect(result).toEqual(expectedState);
    });
  });
});
