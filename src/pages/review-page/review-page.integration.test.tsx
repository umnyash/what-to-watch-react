import { Routes, Route, generatePath } from 'react-router-dom';
import { StatusCodes } from 'http-status-codes';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AppRoute, APIRoute, RequestStatus, SliceName } from '../../const';
import { getMockPageFilm } from '../../mocks/data';
import { withHistory, withStore } from '../../tests/render-helpers';
import { extractActionsTypes } from '../../tests/util';
import { fetchFilm } from '../../store/async-actions';

import ReviewPage from './review-page';

describe('Component: ReviewPage (integration)', () => {
  it('should fetch film when user click retry button', async () => {
    const routeIdParam = 'abc';
    const mockFilm = getMockPageFilm({ id: routeIdParam });
    const retryButtonText = 'Try again';
    const { withHistoryComponent } = withHistory(
      <Routes>
        <Route path={AppRoute.Review} element={<ReviewPage />} />
      </Routes>,
      generatePath(AppRoute.Review, { id: routeIdParam })
    );
    const { withStoreComponent, store, mockAPIAdapter } = withStore(withHistoryComponent, {
      [SliceName.Film]: {
        id: null,
        loadingStatus: RequestStatus.Idle,
        film: null,
        error: null,
      },
      [SliceName.PromoFilm]: {
        film: null,
        loadingStatus: RequestStatus.Idle,
      }
    });
    const apiPath = generatePath(APIRoute.Film, { id: routeIdParam });
    mockAPIAdapter
      .onGet(apiPath).replyOnce(StatusCodes.INTERNAL_SERVER_ERROR)
      .onGet(apiPath).reply(StatusCodes.OK, mockFilm);
    const user = userEvent.setup();

    render(withStoreComponent);
    const retryButtonElement = await screen.findByRole('button', { name: retryButtonText });
    await user.click(retryButtonElement);
    const dispatchedActionsTypes = extractActionsTypes(store.getActions());
    const filmSliceState = store.getState()[SliceName.Film];

    expect(dispatchedActionsTypes).toEqual([
      fetchFilm.pending.type,
      fetchFilm.rejected.type,
      fetchFilm.pending.type,
      fetchFilm.fulfilled.type,
    ]);
    expect(filmSliceState).toEqual({
      id: routeIdParam,
      loadingStatus: RequestStatus.Success,
      film: mockFilm,
      error: null,
    });
  });
});
