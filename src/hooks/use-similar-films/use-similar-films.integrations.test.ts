import { renderHook } from '@testing-library/react';

import { RequestStatus, SliceName } from '../../const';
import { TestStore } from '../../store';
import { extractActionsTypes } from '../../tests/util';
import { withStoreWrapper } from '../../tests/render-helpers';
import { fetchSimilarFilms } from '../../store/async-actions';

import { useSimilarFilms } from './use-similar-films';

const sliceName = SliceName.SimilarFilms;

const assertSimilarFilmsFetched = (store: TestStore, expectedFilmId: string) => {
  const dispatchedActionsTypes = extractActionsTypes(store.getActions());
  const sliceState = store.getState()[sliceName];

  expect(dispatchedActionsTypes).toEqual([fetchSimilarFilms.pending.type]);
  expect(sliceState).toMatchObject({
    filmId: expectedFilmId,
    loadingStatus: RequestStatus.Pending,
  });
};

const assertSimilarFilmsNotFetched = (store: TestStore, expectedFilmId: string, expectedLoadingStatus: RequestStatus) => {
  const dispatchedActions = store.getActions();
  const sliceState = store.getState()[sliceName];

  expect(dispatchedActions).toHaveLength(0);
  expect(sliceState).toMatchObject({
    filmId: expectedFilmId,
    loadingStatus: expectedLoadingStatus,
  });
};

describe('Hook: useSimilarFilms (integration)', () => {
  const sourceFilm1Id = 'id1234';
  const sourceFilm2Id = 'id0000';

  it.each([
    {
      condition: 'id argument mismatch filmId',
      filmId: null,
      loadingStatus: RequestStatus.Idle,
      films: [],
    },
    {
      condition: 'id argument mismatch filmId',
      filmId: sourceFilm2Id,
      loadingStatus: RequestStatus.Pending,
      films: [],
    },
    {
      condition: 'id argument mismatch filmId',
      filmId: sourceFilm2Id,
      loadingStatus: RequestStatus.Success,
      films: [],
    },
    {
      condition: 'id argument mismatch filmId',
      filmId: sourceFilm2Id,
      loadingStatus: RequestStatus.Error,
      films: [],
    },
    {
      condition: 'id argument matches filmId and loading status is Error',
      filmId: sourceFilm2Id,
      loadingStatus: RequestStatus.Error,
      films: [],
    },
  ])('should fetch similar films when $condition', ({ filmId, loadingStatus, films }) => {
    const { WithStoreWrapper, store } = withStoreWrapper({
      [sliceName]: {
        filmId,
        loadingStatus,
        films
      }
    });

    renderHook(() => useSimilarFilms(sourceFilm1Id), { wrapper: WithStoreWrapper });

    assertSimilarFilmsFetched(store, sourceFilm1Id);
  });

  it.each([
    RequestStatus.Pending,
    RequestStatus.Success,
  ])(
    'should not fetch similar films when id argument matches filmId and loading status is %s',
    (loadingStatus) => {
      const { WithStoreWrapper, store } = withStoreWrapper({
        [sliceName]: {
          filmId: sourceFilm1Id,
          loadingStatus,
          films: [],
        }
      });

      renderHook(() => useSimilarFilms(sourceFilm1Id), { wrapper: WithStoreWrapper });

      assertSimilarFilmsNotFetched(store, sourceFilm1Id, loadingStatus);
    }
  );

  it('should fetch similar films on rerender with another id', () => {
    const { WithStoreWrapper, store } = withStoreWrapper({
      [sliceName]: {
        filmId: sourceFilm1Id,
        loadingStatus: RequestStatus.Success,
        films: [],
      }
    });

    const { rerender } = renderHook(
      ({ id }) => useSimilarFilms(id),
      {
        initialProps: { id: sourceFilm1Id },
        wrapper: WithStoreWrapper,
      }
    );
    rerender({ id: sourceFilm2Id });

    assertSimilarFilmsFetched(store, sourceFilm2Id);
  });
});
