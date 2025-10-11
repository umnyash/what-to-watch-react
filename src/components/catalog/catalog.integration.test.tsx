import { StatusCodes } from 'http-status-codes';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { FILMS_PER_LOAD, APIRoute, RequestStatus, SliceName } from '../../const';
import { withStore } from '../../tests/render-helpers';
import { extractActionsTypes } from '../../tests/util';
import { fetchFilms } from '../../store/async-actions';
import { catalogActions } from '../../store/catalog/catalog.slice';

import Catalog from './catalog';

describe('Component: Catalog (integration)', () => {
  const sliceName = SliceName.Catalog;

  describe('fetch films', () => {
    it.each([
      RequestStatus.Idle,
      RequestStatus.Error,
    ])('should fetch films on mount when filmsLoadingStatus is %s', (loadingStatus) => {
      const { withStoreComponent, store, mockAPIAdapter } = withStore(<Catalog />, {
        [sliceName]: {
          films: [],
          filmsLoadingStatus: loadingStatus,
          filter: {
            genre: null,
          },
          displayedFilmsMaxCount: FILMS_PER_LOAD,
        }
      });
      mockAPIAdapter.onGet(APIRoute.Films).reply(StatusCodes.OK, []);

      render(withStoreComponent);
      const dispatchedActionsTypes = extractActionsTypes(store.getActions());
      const sliceState = store.getState()[sliceName];

      expect(dispatchedActionsTypes).toContain(fetchFilms.pending.type);
      expect(sliceState.filmsLoadingStatus).toBe(RequestStatus.Pending);
    });

    it.each([
      RequestStatus.Pending,
      RequestStatus.Success,
    ])('should not fetch films on mount when filmsLoadingStatus is %s', (loadingStatus) => {
      const { withStoreComponent, store } = withStore(<Catalog />, {
        [sliceName]: {
          films: [],
          filmsLoadingStatus: loadingStatus,
          filter: {
            genre: null,
          },
          displayedFilmsMaxCount: FILMS_PER_LOAD,
        }
      });

      render(withStoreComponent);
      const dispatchedActionsTypes = extractActionsTypes(store.getActions());
      const sliceState = store.getState()[sliceName];

      expect(dispatchedActionsTypes).not.toContain(fetchFilms.pending.type);
      expect(sliceState.filmsLoadingStatus).toBe(loadingStatus);
    });

    it('should fetch films on clicking retry button', async () => {
      const retryButtonText = 'Try again';
      const { withStoreComponent, store, mockAPIAdapter } = withStore(<Catalog />);
      mockAPIAdapter
        .onGet(APIRoute.Films).replyOnce(StatusCodes.INTERNAL_SERVER_ERROR)
        .onGet(APIRoute.Films).reply(StatusCodes.OK, []);
      const user = userEvent.setup();

      render(withStoreComponent);
      const retryButtonElement = await screen.findByRole('button', { name: retryButtonText });
      expect(store.getState()[sliceName]).toMatchObject({
        filmsLoadingStatus: RequestStatus.Error,
      });
      await user.click(retryButtonElement);
      const dispatchedActionsTypes = extractActionsTypes(store.getActions());
      const sliceState = store.getState()[sliceName];

      expect(dispatchedActionsTypes).toEqual(expect.arrayContaining([
        fetchFilms.pending.type,
        fetchFilms.rejected.type,
        fetchFilms.pending.type,
        fetchFilms.fulfilled.type,
      ]));
      expect(sliceState.filmsLoadingStatus).toBe(RequestStatus.Success);
    });
  });

  describe('reset displayedFilmsMaxCount', () => {
    it('should reset displayedFilmsMaxCount on mount', () => {
      const { withStoreComponent, store } = withStore(<Catalog />, {
        [sliceName]: {
          films: [],
          filmsLoadingStatus: RequestStatus.Success,
          filter: { genre: null },
          displayedFilmsMaxCount: FILMS_PER_LOAD + FILMS_PER_LOAD,
        }
      });

      render(withStoreComponent);

      expect(store.getState()[sliceName]).toMatchObject({
        displayedFilmsMaxCount: FILMS_PER_LOAD,
      });
    });

    it('should not reset displayedFilmsMaxCount on rerender', () => {
      const expectedDisplayedFilmsMaxCount = FILMS_PER_LOAD + FILMS_PER_LOAD + FILMS_PER_LOAD;
      const { withStoreComponent, store } = withStore(<Catalog />);

      const { rerender } = render(withStoreComponent);
      store.dispatch(catalogActions.increaseDisplayedFilmsMaxCount());
      store.dispatch(catalogActions.increaseDisplayedFilmsMaxCount());

      expect(store.getState()[sliceName]).toMatchObject({
        displayedFilmsMaxCount: expectedDisplayedFilmsMaxCount,
      });

      rerender(withStoreComponent);

      expect(store.getState()[sliceName]).toMatchObject({
        displayedFilmsMaxCount: expectedDisplayedFilmsMaxCount,
      });
    });
  });
});
