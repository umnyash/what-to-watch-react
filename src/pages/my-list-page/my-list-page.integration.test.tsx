import { HelmetProvider } from 'react-helmet-async';
import { StatusCodes } from 'http-status-codes';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { APIRoute, RequestStatus, SliceName } from '../../const';
import { getMockFilms } from '../../mocks/data';
import { withStore } from '../../tests/render-helpers';
import { extractActionsTypes } from '../../tests/util';
import { fetchFavorites } from '../../store/async-actions';

import MyListPage from './my-list-page';

vi.mock('../../components/site-header', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../../components/site-footer', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../../components/films-list', () => ({
  default: vi.fn(() => null)
}));

describe('Component: MyListPage (integration)', () => {
  const sliceName = SliceName.Favorites;
  const mockFilms = getMockFilms(2);

  it('should fetch favorites when user click retry button', async () => {
    const retryButtonText = 'Try again';
    const { withStoreComponent, store, mockAPIAdapter } = withStore(<MyListPage />, {
      [sliceName]: {
        films: [],
        loadingStatus: RequestStatus.Error,
        changingStatusFilmsIds: [],
      }
    });
    mockAPIAdapter.onGet(APIRoute.Favorites).reply(StatusCodes.OK, mockFilms);
    const user = userEvent.setup();

    render(
      <HelmetProvider>{withStoreComponent}</HelmetProvider>
    );
    const retryButtonElement = screen.getByRole('button', { name: retryButtonText });
    await user.click(retryButtonElement);
    const dispatchedActionsTypes = extractActionsTypes(store.getActions());
    const sliceState = store.getState()[sliceName];

    expect(dispatchedActionsTypes).toEqual([
      fetchFavorites.pending.type,
      fetchFavorites.fulfilled.type,
    ]);
    expect(sliceState).toMatchObject({
      loadingStatus: RequestStatus.Success,
      films: mockFilms,
    });
  });
});
