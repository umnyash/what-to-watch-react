import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StatusCodes } from 'http-status-codes';

import { APIRoute, RequestStatus, SliceName } from '../../const';
import { getMockPromoFilm } from '../../mocks/data';
import { extractActionsTypes } from '../../tests/util';
import { withStore } from '../../tests/render-helpers';
import { fetchPromoFilm } from '../../store/async-actions';

import PromoFilm from './promo-film';

vi.mock('../site-header', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../film-header', () => ({
  default: vi.fn(() => null)
}));

describe('Component: PromoFilm (integration)', () => {
  const sliceName = SliceName.PromoFilm;
  const mockFilm = getMockPromoFilm();

  it.each([
    RequestStatus.Idle,
    RequestStatus.Error,
  ])('should fetch promo film on mount when loadingStatus is %s', (loadingStatus) => {
    const { withStoreComponent, store, mockAPIAdapter } = withStore(<PromoFilm />, {
      [sliceName]: {
        film: null,
        loadingStatus,
      }
    });
    mockAPIAdapter.onGet(APIRoute.Promo).reply(StatusCodes.OK, mockFilm);

    render(withStoreComponent);
    const dispatchedActionsTypes = extractActionsTypes(store.getActions());
    const sliceState = store.getState()[sliceName];

    expect(dispatchedActionsTypes).toContain(fetchPromoFilm.pending.type);
    expect(sliceState).toMatchObject({
      loadingStatus: RequestStatus.Pending,
    });
  });

  it.each([
    [RequestStatus.Pending, null],
    [RequestStatus.Success, mockFilm],
  ])('should not fetch promo film on mount when filmsLoadingStatus is %s', (loadingStatus, film) => {
    const { withStoreComponent, store } = withStore(<PromoFilm />, {
      [sliceName]: {
        film,
        loadingStatus,
      }
    });

    render(withStoreComponent);
    const dispatchedActions = store.getActions();
    const sliceState = store.getState()[sliceName];

    expect(dispatchedActions).toHaveLength(0);
    expect(sliceState).toMatchObject({
      loadingStatus: loadingStatus,
    });
  });

  it('should fetch promo film on clicking retry button', async () => {
    const retryButtonText = 'Try again';
    const { withStoreComponent, store, mockAPIAdapter } = withStore(<PromoFilm />);
    mockAPIAdapter
      .onGet(APIRoute.Promo).replyOnce(StatusCodes.INTERNAL_SERVER_ERROR)
      .onGet(APIRoute.Promo).reply(StatusCodes.OK, mockFilm);
    const user = userEvent.setup();

    render(withStoreComponent);
    const retryButtonElement = await screen.findByRole('button', { name: retryButtonText });
    expect(store.getState()[sliceName]).toMatchObject({
      loadingStatus: RequestStatus.Error,
    });
    await user.click(retryButtonElement);

    expect(store.getState()[sliceName]).toMatchObject({
      loadingStatus: RequestStatus.Success,
    });
  });
});
