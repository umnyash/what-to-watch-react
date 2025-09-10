import { RequestStatus, SliceName } from '../../const';
import { State } from '../../types/state';
import { getMockFilms } from '../../mocks/data';
import { favoritesSelectors } from './favorites.selectors';

describe('Selectors: favorites', () => {
  const sliceName = SliceName.Favorites;

  const state: Pick<State, SliceName.Favorites> = {
    [sliceName]: {
      films: getMockFilms(2),
      loadingStatus: RequestStatus.Idle,
      changingStatusFilmsIds: ['id1', 'id2'],
    }
  };

  it('should return films from state', () => {
    const { films } = state[sliceName];
    const result = favoritesSelectors.films(state);
    expect(result).toEqual(films);
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

      expect(favoritesSelectors.isLoading(state)).toBe(expectedIsLoadingValue);
      expect(favoritesSelectors.isLoaded(state)).toBe(expectedIsLoadedValue);
      expect(favoritesSelectors.isLoadFailed(state)).toBe(expectedIsLoadFailedValue);
    }
  );

  it('should return changing status films IDs', () => {
    const { changingStatusFilmsIds } = state[sliceName];
    const result = favoritesSelectors.changingStatusFilmsIds(state);
    expect(result).toEqual(changingStatusFilmsIds);
  });
});
