import { RequestStatus, SliceName } from '../../const';
import { State } from '../../types/state';
import { getMockPromoFilm } from '../../mocks/data';

import { promoFilmSelectors } from './promo-film.selectors';

describe('Selectors: promoFilm', () => {
  const sliceName = SliceName.PromoFilm;

  const state: Pick<State, SliceName.PromoFilm> = {
    [sliceName]: {
      film: getMockPromoFilm(),
      loadingStatus: RequestStatus.Success,
    }
  };

  it('should return film from state', () => {
    const { film } = state[sliceName];
    const result = promoFilmSelectors.film(state);
    expect(result).toEqual(film);
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

      expect(promoFilmSelectors.isLoading(state)).toBe(expectedIsLoadingValue);
      expect(promoFilmSelectors.isLoaded(state)).toBe(expectedIsLoadedValue);
      expect(promoFilmSelectors.isLoadFailed(state)).toBe(expectedIsLoadFailedValue);
    }
  );
});
