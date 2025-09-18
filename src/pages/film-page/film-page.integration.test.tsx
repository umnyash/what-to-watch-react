import { Routes, Route, generatePath } from 'react-router-dom';
import { StatusCodes } from 'http-status-codes';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AppRoute, APIRoute, RequestStatus, SliceName } from '../../const';
import { getMockPageFilm } from '../../mocks/data';
import { withHistory, withStore } from '../../tests/render-helpers';
import { extractActionsTypes } from '../../tests/util';
import { fetchFilm } from '../../store/async-actions';

import FilmPage from './film-page';

vi.mock('../../components/film-page-content', () => ({
  default: vi.fn(() => null)
}));

describe('Component: FilmPage (integration)', () => {
  const sliceName = SliceName.Film;
  const mockFilm = getMockPageFilm();

  it('should fetch film when user click retry button', async () => {
    const retryButtonText = 'Try again';
    const { withHistoryComponent } = withHistory(
      <Routes>
        <Route path={AppRoute.Film} element={<FilmPage />} />
      </Routes>,
      generatePath(AppRoute.Film, { id: mockFilm.id })
    );
    const { withStoreComponent, store, mockAPIAdapter } = withStore(withHistoryComponent, {
      [sliceName]: {
        id: null,
        loadingStatus: RequestStatus.Idle,
        film: null,
        error: null,
      }
    });
    const apiPath = generatePath(APIRoute.Film, { id: mockFilm.id });
    mockAPIAdapter
      .onGet(apiPath).replyOnce(StatusCodes.INTERNAL_SERVER_ERROR)
      .onGet(apiPath).reply(StatusCodes.OK, mockFilm);
    const user = userEvent.setup();

    render(withStoreComponent);
    const retryButtonElement = await screen.findByRole('button', { name: retryButtonText });
    await user.click(retryButtonElement);
    const dispatchedActionsTypes = extractActionsTypes(store.getActions());
    const sliceState = store.getState()[sliceName];

    expect(dispatchedActionsTypes).toEqual([
      fetchFilm.pending.type,
      fetchFilm.rejected.type,
      fetchFilm.pending.type,
      fetchFilm.fulfilled.type,
    ]);
    expect(sliceState).toMatchObject({
      loadingStatus: RequestStatus.Success,
      film: mockFilm,
    });
  });
});
