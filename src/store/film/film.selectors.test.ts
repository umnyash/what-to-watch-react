import { StatusCodes } from 'http-status-codes';

import { ERROR_PLACEHOLDER_MESSAGE, RequestStatus, SliceName } from '../../const';
import { State } from '../../types/state';
import { getMockPageFilm } from '../../mocks/data';

import { filmSelectors } from './film.selectors';

describe('Selectors: film', () => {
  const sliceName = SliceName.Film;
  const mockFilm = getMockPageFilm();

  const state: Pick<State, SliceName.Film> = {
    [sliceName]: {
      id: mockFilm.id,
      loadingStatus: RequestStatus.Success,
      film: mockFilm,
      error: ERROR_PLACEHOLDER_MESSAGE,
    }
  };

  it('should return id from state', () => {
    const { id } = state[sliceName];
    const result = filmSelectors.id(state);
    expect(result).toEqual(id);
  });

  it('should return film from state', () => {
    const { film } = state[sliceName];
    const result = filmSelectors.film(state);
    expect(result).toEqual(film);
  });

  it.each([
    [RequestStatus.Idle, false, false, false],
    [RequestStatus.Pending, true, false, false],
    [RequestStatus.Success, false, true, false],
    [RequestStatus.Error, false, false, true],
  ])(
    'when loading status is %s – isLoading → %s, isLoadFailded → %s',
    (loadingStatus, expectedIsLoadingValue, expectedIsLoadedValue, expectedIsLoadFailedValue) => {
      state[sliceName].loadingStatus = loadingStatus;

      expect(filmSelectors.isLoading(state)).toBe(expectedIsLoadingValue);
      expect(filmSelectors.isLoaded(state)).toBe(expectedIsLoadedValue);
      expect(filmSelectors.isLoadFailed(state)).toBe(expectedIsLoadFailedValue);
    }
  );

  it.each([
    {
      condition: 'no error',
      value: null,
      expected: false,
    },
    {
      condition: 'error is string',
      value: ERROR_PLACEHOLDER_MESSAGE,
      expected: false,
    },
    {
      condition: 'not 404 error',
      value: { status: StatusCodes.SERVICE_UNAVAILABLE },
      expected: false,
    },
    {
      condition: 'error 404',
      value: { status: StatusCodes.NOT_FOUND },
      expected: true
    },
  ])(
    'isNotFound should return $expected when $condition',
    ({ value, expected }) => {
      state[sliceName].error = value;
      expect(filmSelectors.isNotFound(state)).toBe(expected);
    }
  );
});
