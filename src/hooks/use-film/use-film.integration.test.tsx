import { renderHook } from '@testing-library/react';

import { RequestStatus, SliceName } from '../../const';
import { UNEXPECTED_ERROR } from '../../services/api';
import { TestStore } from '../../store';
import { getMockPageFilm, getMockPromoFilm } from '../../mocks/data';
import { extractActionsTypes } from '../../tests/util';
import { withStoreWrapper } from '../../tests/render-helpers';
import { fetchPromoFilm, fetchFilm } from '../../store/async-actions';

import { useFilm } from './use-film';

const assertPromoFilmFetched = (store: TestStore) => {
  const dispatchedActionsTypes = extractActionsTypes(store.getActions());
  const sliceState = store.getState()[SliceName.PromoFilm];

  expect(dispatchedActionsTypes).toContain(fetchPromoFilm.pending.type);
  expect(sliceState).toMatchObject({
    loadingStatus: RequestStatus.Pending,
  });
};

const assertPromoFilmNotFetched = (store: TestStore, expectedLoadingStatus: RequestStatus) => {
  const dispatchedActions = store.getActions();
  const sliceState = store.getState()[SliceName.PromoFilm];

  expect(dispatchedActions).not.toContain(fetchPromoFilm.pending.type);
  expect(sliceState).toMatchObject({
    loadingStatus: expectedLoadingStatus
  });
};

const assertFilmFetched = (store: TestStore, expectedRequestedFilmId: string) => {
  const dispatchedActionsTypes = extractActionsTypes(store.getActions());
  const sliceState = store.getState()[SliceName.Film];

  expect(dispatchedActionsTypes).toContain(fetchFilm.pending.type);
  expect(sliceState).toMatchObject({
    id: expectedRequestedFilmId,
    loadingStatus: RequestStatus.Pending,
  });
};

const assertFilmNotFetched = (
  store: TestStore,
  expectedRequestedFilmId: string | null,
  expectedLoadingStatus: RequestStatus
) => {
  const dispatchedActions = store.getActions();
  const sliceState = store.getState()[SliceName.Film];

  expect(dispatchedActions).not.toContain(fetchFilm.pending.type);
  expect(sliceState).toMatchObject({
    id: expectedRequestedFilmId,
    loadingStatus: expectedLoadingStatus,
  });
};

describe('Hook: useFilmData (integration)', () => {
  const nonTargetFilmId = 'id0';
  const targetFilmId = 'id1';
  const newTargetFilmId = 'id2';
  const mockPromoFilm = getMockPromoFilm();
  const mockPromoFilmWithTargetId = getMockPromoFilm({ id: targetFilmId });
  const mockFilmWithTargetId = getMockPageFilm({ id: targetFilmId });

  describe('promo film fetching', () => {
    it.each([
      RequestStatus.Idle,
      RequestStatus.Error,
    ])('should fetch promo film on mount when id argument is not provided and loading status is %s', (loadingStatus) => {
      const { WithStoreWrapper, store } = withStoreWrapper({
        [SliceName.PromoFilm]: {
          film: null,
          loadingStatus,
        },
      });

      renderHook(() => useFilm(), { wrapper: WithStoreWrapper });

      assertPromoFilmFetched(store);
    });

    it.each([
      [RequestStatus.Pending, null],
      [RequestStatus.Success, mockPromoFilm],
    ])('should not fetch promo film on mount when id argument is not provided and loading status is %s', (loadingStatus, film) => {
      const { WithStoreWrapper, store } = withStoreWrapper({
        [SliceName.PromoFilm]: {
          film,
          loadingStatus,
        },
      });

      renderHook(() => useFilm(), { wrapper: WithStoreWrapper });

      assertPromoFilmNotFetched(store, loadingStatus);
    });

    it.each([
      [RequestStatus.Idle, null],
      [RequestStatus.Pending, null],
      [RequestStatus.Success, mockPromoFilm],
      [RequestStatus.Error, null],
    ])('should not fetch promo film on mount when id argument is provided', (loadingStatus, film) => {
      const { WithStoreWrapper, store } = withStoreWrapper({
        [SliceName.PromoFilm]: {
          film,
          loadingStatus,
        },
      });

      renderHook(() => useFilm(targetFilmId), { wrapper: WithStoreWrapper });

      assertPromoFilmNotFetched(store, loadingStatus);
    });

    it.each([
      RequestStatus.Idle,
      RequestStatus.Error,
    ])('should fetch promo film on rerender without id argument when promo film loading status is %s', (loadingStatus) => {
      const { WithStoreWrapper, store } = withStoreWrapper({
        [SliceName.PromoFilm]: {
          film: null,
          loadingStatus,
        },
        [SliceName.Film]: {
          id: targetFilmId,
          film: mockFilmWithTargetId,
          loadingStatus: RequestStatus.Success,
          error: null,
        }
      });

      const { rerender } = renderHook(
        (props) => useFilm(props?.id),
        {
          wrapper: WithStoreWrapper,
          initialProps: { id: targetFilmId }
        }
      );
      rerender();

      assertPromoFilmFetched(store);
    });
  });

  describe('film fetching', () => {
    describe.each([
      {
        condition: 'id argument mismatch requested film id',
        requestedFilmId: null,
        film: null,
        loadingStatus: RequestStatus.Idle,
        error: null,
      },
      {
        condition: 'id argument mismatch requested film id',
        requestedFilmId: nonTargetFilmId,
        film: null,
        loadingStatus: RequestStatus.Pending,
        error: null,
      },
      {
        condition: 'id argument mismatch requested film id',
        requestedFilmId: nonTargetFilmId,
        film: getMockPageFilm({ id: nonTargetFilmId }),
        loadingStatus: RequestStatus.Success,
        error: null,
      },
      {
        condition: 'id argument mismatch requested film id',
        requestedFilmId: nonTargetFilmId,
        film: null,
        loadingStatus: RequestStatus.Error,
        error: UNEXPECTED_ERROR,
      },
      {
        condition: 'id argument matches requested film id and loading status is Error',
        requestedFilmId: targetFilmId,
        film: null,
        loadingStatus: RequestStatus.Error,
        error: UNEXPECTED_ERROR,
      },
    ])('film slice state', ({ condition, requestedFilmId, film, loadingStatus, error }) => {
      it.each([
        [null, RequestStatus.Idle],
        [mockPromoFilm, RequestStatus.Success],
        [mockPromoFilmWithTargetId, RequestStatus.Success]
      ])(
        `should fetch film when id is provided, isDetailed is true and ${condition}`,
        (promoFilm, promoFilmLoadingStatus) => {
          const { WithStoreWrapper, store } = withStoreWrapper({
            [SliceName.PromoFilm]: {
              film: promoFilm,
              loadingStatus: promoFilmLoadingStatus,
            },
            [SliceName.Film]: {
              id: requestedFilmId,
              film,
              loadingStatus,
              error,
            }
          });

          renderHook(() => useFilm(targetFilmId, true), { wrapper: WithStoreWrapper });

          assertFilmFetched(store, targetFilmId);
        }
      );

      it.each([
        [null, RequestStatus.Idle],
        [mockPromoFilm, RequestStatus.Success],
      ])(
        `should fetch film when id is provided, isDetailed is not provided, id mismatch promo film ID and ${condition}`,
        (promoFilm, promoFilmLoadingStatus) => {
          const { WithStoreWrapper, store } = withStoreWrapper({
            [SliceName.PromoFilm]: {
              film: promoFilm,
              loadingStatus: promoFilmLoadingStatus,
            },
            [SliceName.Film]: {
              id: requestedFilmId,
              film,
              loadingStatus,
              error,
            }
          });

          renderHook(() => useFilm(targetFilmId), { wrapper: WithStoreWrapper });

          assertFilmFetched(store, targetFilmId);
        }
      );
    });

    it('should not fetch film when id is not provided', () => {
      const { WithStoreWrapper, store } = withStoreWrapper({
        [SliceName.PromoFilm]: {
          film: null,
          loadingStatus: RequestStatus.Idle,
        },
        [SliceName.Film]: {
          id: null,
          film: null,
          loadingStatus: RequestStatus.Idle,
          error: null,
        }
      });

      renderHook(() => useFilm(), { wrapper: WithStoreWrapper });

      assertFilmNotFetched(store, null, RequestStatus.Idle);
    });

    it('should not fetch film when id is provided, isDetailed not provided and id matches promo film ID', () => {
      const { WithStoreWrapper, store } = withStoreWrapper({
        [SliceName.PromoFilm]: {
          film: mockPromoFilmWithTargetId,
          loadingStatus: RequestStatus.Success,
        },
        [SliceName.Film]: {
          id: null,
          film: null,
          loadingStatus: RequestStatus.Idle,
          error: null,
        }
      });

      renderHook(() => useFilm(targetFilmId), { wrapper: WithStoreWrapper });

      assertFilmNotFetched(store, null, RequestStatus.Idle);
    });

    describe.each([
      [RequestStatus.Idle, null],
      [RequestStatus.Success, mockPromoFilm],
    ])('promo film state', (promoFilmLoadingStatus, promoFilm) => {
      it.each([
        [RequestStatus.Pending, null],
        [RequestStatus.Success, mockFilmWithTargetId],
      ])(
        'should not fetch film when id is provided, isDetailed not provided, id mismatch promo film ID, id matches requested film ID and loading status is %s',
        (loadingStatus, film) => {
          const { WithStoreWrapper, store } = withStoreWrapper({
            [SliceName.PromoFilm]: {
              film: promoFilm,
              loadingStatus: promoFilmLoadingStatus,
            },
            [SliceName.Film]: {
              id: targetFilmId,
              film,
              loadingStatus,
              error: null,
            }
          });

          renderHook(() => useFilm(targetFilmId), { wrapper: WithStoreWrapper });

          assertFilmNotFetched(store, targetFilmId, loadingStatus);
        }
      );
    });

    it('should fetch film on rerender with isDetailed argument', () => {
      const { WithStoreWrapper, store } = withStoreWrapper({
        [SliceName.PromoFilm]: {
          film: mockPromoFilmWithTargetId,
          loadingStatus: RequestStatus.Success,
        },
        [SliceName.Film]: {
          id: null,
          film: null,
          loadingStatus: RequestStatus.Idle,
          error: null,
        }
      });

      const { rerender } = renderHook(
        ({ id, isDetailed }) => useFilm(id, isDetailed as undefined),
        {
          wrapper: WithStoreWrapper,
          initialProps: { id: targetFilmId } as { id: string; isDetailed?: boolean }
        }
      );
      rerender({ id: targetFilmId, isDetailed: true });

      assertFilmFetched(store, targetFilmId);
    });

    it('should fetch film on rerender with another id argument', () => {
      const { WithStoreWrapper, store } = withStoreWrapper({
        [SliceName.PromoFilm]: {
          film: mockPromoFilmWithTargetId,
          loadingStatus: RequestStatus.Success,
        },
        [SliceName.Film]: {
          id: targetFilmId,
          film: mockFilmWithTargetId,
          loadingStatus: RequestStatus.Success,
          error: null,
        }
      });

      const { rerender } = renderHook(
        ({ id, isDetailed }) => useFilm(id, isDetailed),
        {
          wrapper: WithStoreWrapper,
          initialProps: { id: targetFilmId, isDetailed: true } as { id: string; isDetailed: true }
        }
      );
      rerender({ id: newTargetFilmId, isDetailed: true });

      assertFilmFetched(store, newTargetFilmId);
    });
  });
});
