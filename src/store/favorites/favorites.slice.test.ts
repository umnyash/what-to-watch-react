import { RequestStatus } from '../../const';
import { FavoritesState } from '../../types/state';
import { FavoriteStatus } from '../../services/api';
import { getMockFilms, getMockFullFilm } from '../../mocks/data';
import { fetchFavorites, changeFavoriteStatus, logoutUser } from '../async-actions';

import { favoritesSlice } from './favorites.slice';

describe('Slice: favorites', () => {
  const unknownAction = { type: '' };
  const mockFilms = getMockFilms(2);

  it('should return current state when action is unknown', () => {
    const expectedState: FavoritesState = {
      films: mockFilms,
      loadingStatus: RequestStatus.Success,
      changingStatusFilmsIds: ['id1', 'id2'],
    };

    const result = favoritesSlice.reducer(expectedState, unknownAction);

    expect(result).toEqual(expectedState);
  });

  it('should return initial state when state is undefined and action is unknown', () => {
    const expectedState: FavoritesState = {
      films: [],
      loadingStatus: RequestStatus.Idle,
      changingStatusFilmsIds: [],
    };

    const result = favoritesSlice.reducer(undefined, unknownAction);

    expect(result).toEqual(expectedState);
  });

  describe('fetchFavorites', () => {
    it(`should set "${RequestStatus.Pending}" loading status on "fetchFavorites.pending" action`, () => {
      const expectedState: FavoritesState = {
        films: [],
        loadingStatus: RequestStatus.Pending,
        changingStatusFilmsIds: [],
      };

      const result = favoritesSlice.reducer(undefined, fetchFavorites.pending);

      expect(result).toEqual(expectedState);
    });

    it(`should set favorites data and "${RequestStatus.Success}" loading status on "fetchFavorites.fulfilled" action`, () => {
      const initialState: FavoritesState = {
        films: [],
        loadingStatus: RequestStatus.Pending,
        changingStatusFilmsIds: [],
      };
      const expectedState: FavoritesState = {
        ...initialState,
        films: mockFilms,
        loadingStatus: RequestStatus.Success,
      };

      const result = favoritesSlice.reducer(initialState, fetchFavorites.fulfilled(
        mockFilms, '', undefined
      ));

      expect(result).toEqual(expectedState);
    });

    it(`should set "${RequestStatus.Error}" loading status on "fetchFavorites.rejected" action`, () => {
      const initialState: FavoritesState = {
        films: [],
        loadingStatus: RequestStatus.Pending,
        changingStatusFilmsIds: [],
      };
      const expectedState: FavoritesState = {
        ...initialState,
        loadingStatus: RequestStatus.Error,
      };

      const result = favoritesSlice.reducer(initialState, fetchFavorites.rejected);

      expect(result).toEqual(expectedState);
    });
  });

  describe('changeFavoriteStatus', () => {
    it('should not modify favorites data and add film ID to changingStatusFilmsIds array on "changeFavoriteStatus.pending" action', () => {
      const mockChangingFilmId = 'changing-film-id';
      const initialState: FavoritesState = {
        films: [],
        loadingStatus: RequestStatus.Success,
        changingStatusFilmsIds: ['id1', 'id2'],
      };
      const expectedState: FavoritesState = {
        ...initialState,
        changingStatusFilmsIds: ['id1', 'id2', mockChangingFilmId],
      };

      const result = favoritesSlice.reducer(initialState, changeFavoriteStatus.pending(
        '', { filmId: mockChangingFilmId, status: FavoriteStatus.On }
      ));

      expect(result).toEqual(expectedState);
    });

    describe('adding to favorites', () => {
      const mockAddingFilm = getMockFullFilm({ isFavorite: true });

      it('should add film to favorites data and remove its ID from changingStatusFilmsIds array when adding succeeds on "changeFavoriteStatus.fulfilled" action', () => {
        const initialState: FavoritesState = {
          films: mockFilms,
          loadingStatus: RequestStatus.Success,
          changingStatusFilmsIds: ['id1', mockAddingFilm.id, 'id2'],
        };
        const expectedState: FavoritesState = {
          ...initialState,
          films: [...mockFilms, mockAddingFilm],
          changingStatusFilmsIds: ['id1', 'id2'],
        };

        const result = favoritesSlice.reducer(initialState, changeFavoriteStatus.fulfilled(
          mockAddingFilm, '', { filmId: mockAddingFilm.id, status: FavoriteStatus.On }
        ));

        expect(result).toEqual(expectedState);
      });

      it.each([
        RequestStatus.Pending,
        RequestStatus.Error,
      ])(
        'should not add film to favorites data when favorites not loaded and adding succeeds on "changeFavoriteStatus.fulfilled" action',
        (loadingStatus) => {
          const initialState: FavoritesState = {
            films: [],
            loadingStatus: loadingStatus,
            changingStatusFilmsIds: [mockAddingFilm.id],
          };
          const expectedState: FavoritesState = {
            ...initialState,
            changingStatusFilmsIds: [],
          };

          const result = favoritesSlice.reducer(initialState, changeFavoriteStatus.fulfilled(
            mockAddingFilm, '', { filmId: mockAddingFilm.id, status: FavoriteStatus.On }
          ));

          expect(result).toEqual(expectedState);
        }
      );

      it('should not modify favorites data when adding favorite fails and remove film ID from changingStatusFilmsIds array on "changeFavoriteStatus.rejected" action', () => {
        const initialState: FavoritesState = {
          films: [],
          loadingStatus: RequestStatus.Success,
          changingStatusFilmsIds: ['id1', mockAddingFilm.id, 'id2'],
        };
        const expectedState: FavoritesState = {
          ...initialState,
          changingStatusFilmsIds: ['id1', 'id2'],
        };

        const result = favoritesSlice.reducer(initialState, changeFavoriteStatus.rejected(
          null, '', { filmId: mockAddingFilm.id, status: FavoriteStatus.On }
        ));

        expect(result).toEqual(expectedState);
      });
    });

    describe('removing from favorites', () => {
      const mockRemovingFilm = getMockFullFilm({ isFavorite: true });

      it('should remove film from favorites data and remove its ID from changingStatusFilmsIds array when removing succeeds on "changeFavoriteStatus.fulfilled" action', () => {
        const mockNextFavoritesFilms = getMockFilms(3);

        const initialState: FavoritesState = {
          films: [...mockFilms, mockRemovingFilm, ...mockNextFavoritesFilms],
          loadingStatus: RequestStatus.Success,
          changingStatusFilmsIds: ['id1', mockRemovingFilm.id, 'id2'],
        };
        const expectedState: FavoritesState = {
          ...initialState,
          films: [...mockFilms, ...mockNextFavoritesFilms],
          changingStatusFilmsIds: ['id1', 'id2'],
        };

        const result = favoritesSlice.reducer(initialState, changeFavoriteStatus.fulfilled(
          { ...mockRemovingFilm, isFavorite: false },
          '',
          { filmId: mockRemovingFilm.id, status: FavoriteStatus.Off }
        ));

        expect(result).toEqual(expectedState);
      });

      it.each([
        RequestStatus.Pending,
        RequestStatus.Error,
      ])(
        'should safely handle favorite removal attempt from empty favorites when favorites not loaded on "changeFavoriteStatus.fulfilled" action',
        (loadingStatus) => {
          const initialState: FavoritesState = {
            films: [],
            loadingStatus: loadingStatus,
            changingStatusFilmsIds: [mockRemovingFilm.id],
          };
          const expectedState: FavoritesState = {
            ...initialState,
            changingStatusFilmsIds: [],
          };

          const result = favoritesSlice.reducer(initialState, changeFavoriteStatus.fulfilled(
            { ...mockRemovingFilm, isFavorite: false }, '', { filmId: mockRemovingFilm.id, status: FavoriteStatus.Off }
          ));

          expect(result).toEqual(expectedState);
        }
      );

      it('should not modify favorites data when removing favorite fails and remove film ID from changingStatusFilmsIds array on "changeFavoriteStatus.rejected" action', () => {
        const initialState: FavoritesState = {
          films: [mockRemovingFilm],
          loadingStatus: RequestStatus.Success,
          changingStatusFilmsIds: ['id1', mockRemovingFilm.id, 'id2'],
        };
        const expectedState: FavoritesState = {
          ...initialState,
          changingStatusFilmsIds: ['id1', 'id2'],
        };

        const result = favoritesSlice.reducer(initialState, changeFavoriteStatus.rejected(
          null, '', { filmId: mockRemovingFilm.id, status: FavoriteStatus.Off }
        ));

        expect(result).toEqual(expectedState);
      });
    });
  });

  describe('logoutUser', () => {
    it('should reset loading status and films data on "logoutUser.fulfilled" action', () => {
      const initialState: FavoritesState = {
        films: mockFilms,
        loadingStatus: RequestStatus.Success,
        changingStatusFilmsIds: ['id1'],
      };
      const expectedState: FavoritesState = {
        ...initialState,
        films: [],
        loadingStatus: RequestStatus.Idle,
      };

      const result = favoritesSlice.reducer(initialState, logoutUser.fulfilled);

      expect(result).toEqual(expectedState);
    });
  });
});
