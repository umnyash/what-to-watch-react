import { renderHook } from '@testing-library/react';

import { FILMS_PER_LOAD, RequestStatus, SliceName } from '../../const';
import { extractActionsTypes } from '../../tests/util';
import { withStoreWrapper } from '../../tests/render-helpers';
import { fetchFilms } from '../../store/async-actions';

import { useLoadFilms } from './use-load-films';

describe('Hook: useLoadFilms', () => {
  const sliceName = SliceName.Catalog;

  it.each([
    RequestStatus.Idle,
    RequestStatus.Error
  ])('should fetch films on mount when loading status is %s', (loadingStatus) => {
    const { WithStoreWrapper, store } = withStoreWrapper({
      [sliceName]: {
        films: [],
        filmsLoadingStatus: loadingStatus,
        filter: {
          genre: null,
        },
        displayedFilmsMaxCount: FILMS_PER_LOAD
      }
    });

    renderHook(() => useLoadFilms(), { wrapper: WithStoreWrapper });
    const dispatchedActionsTypes = extractActionsTypes(store.getActions());

    expect(dispatchedActionsTypes).toEqual([fetchFilms.pending.type]);
  });

  it.each([
    RequestStatus.Pending,
    RequestStatus.Success,
  ])('should not fetch films on mount when loading status is %s', (loadingStatus) => {
    const { WithStoreWrapper, store } = withStoreWrapper({
      [sliceName]: {
        films: [],
        filmsLoadingStatus: loadingStatus,
        filter: {
          genre: null,
        },
        displayedFilmsMaxCount: FILMS_PER_LOAD
      }
    });

    renderHook(() => useLoadFilms(), { wrapper: WithStoreWrapper });
    const dispatchedActions = store.getActions();

    expect(dispatchedActions).toHaveLength(0);
  });
});
