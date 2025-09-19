import { renderHook } from '@testing-library/react';

import { RequestStatus, SliceName } from '../../const';
import { TestStore } from '../../store';
import { extractActionsTypes } from '../../tests/util';
import { withStoreWrapper } from '../../tests/render-helpers';
import { fetchReviews } from '../../store/async-actions';

import { useFilmReviews } from './use-film-reviews';

const sliceName = SliceName.Reviews;

const assertFilmReviewsFetched = (store: TestStore, expectedFilmId: string) => {
  const dispatchedActionsTypes = extractActionsTypes(store.getActions());
  const sliceState = store.getState()[sliceName];

  expect(dispatchedActionsTypes).toEqual([fetchReviews.pending.type]);
  expect(sliceState).toMatchObject({
    filmId: expectedFilmId,
    loadingStatus: RequestStatus.Pending,
  });
};

const assertFilmReviewsNotFetched = (
  store: TestStore,
  expectedFilmId: string,
  expectedLoadingStatus: RequestStatus
) => {
  const dispatchedActions = store.getActions();
  const sliceState = store.getState()[sliceName];

  expect(dispatchedActions).toHaveLength(0);
  expect(sliceState).toMatchObject({
    filmId: expectedFilmId,
    loadingStatus: expectedLoadingStatus,
  });
};

describe('Hook: useFilmReviews (integration)', () => {
  const sourceFilm1Id = 'id1234';
  const sourceFilm2Id = 'id0000';

  it.each([
    {
      condition: 'id argument mismatch filmId',
      filmId: null,
      loadingStatus: RequestStatus.Idle,
      reviews: [],
    },
    {
      condition: 'id argument mismatch filmId',
      filmId: sourceFilm2Id,
      loadingStatus: RequestStatus.Pending,
      reviews: [],
    },
    {
      condition: 'id argument mismatch filmId',
      filmId: sourceFilm2Id,
      loadingStatus: RequestStatus.Success,
      reviews: [],
    },
    {
      condition: 'id argument mismatch filmId',
      filmId: sourceFilm2Id,
      loadingStatus: RequestStatus.Error,
      reviews: [],
    },
    {
      condition: 'id argument matches filmId and loading status is Error',
      filmId: sourceFilm1Id,
      loadingStatus: RequestStatus.Error,
      reviews: [],
    },
  ])('should fetch reviews when $condition', ({ filmId, loadingStatus, reviews }) => {
    const { WithStoreWrapper, store } = withStoreWrapper({
      [sliceName]: {
        filmId,
        loadingStatus,
        reviews
      }
    });

    renderHook(() => useFilmReviews(sourceFilm1Id), { wrapper: WithStoreWrapper });

    assertFilmReviewsFetched(store, sourceFilm1Id);
  });

  it.each([
    RequestStatus.Pending,
    RequestStatus.Success,
  ])(
    'should not fetch reviews when id argument matches filmId and loading status is %s',
    (loadingStatus) => {
      const { WithStoreWrapper, store } = withStoreWrapper({
        [sliceName]: {
          filmId: sourceFilm1Id,
          loadingStatus,
          reviews: [],
        }
      });

      renderHook(() => useFilmReviews(sourceFilm1Id), { wrapper: WithStoreWrapper });

      assertFilmReviewsNotFetched(store, sourceFilm1Id, loadingStatus);
    }
  );

  it('should fetch reviews on rerender with another id', () => {
    const { WithStoreWrapper, store } = withStoreWrapper({
      [sliceName]: {
        filmId: sourceFilm1Id,
        loadingStatus: RequestStatus.Success,
        reviews: [],
      }
    });

    const { rerender } = renderHook(
      ({ id }) => useFilmReviews(id),
      {
        initialProps: { id: sourceFilm1Id },
        wrapper: WithStoreWrapper,
      }
    );
    rerender({ id: sourceFilm2Id });

    assertFilmReviewsFetched(store, sourceFilm2Id);
  });
});
