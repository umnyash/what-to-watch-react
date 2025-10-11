import { generatePath } from 'react-router-dom';
import { StatusCodes } from 'http-status-codes';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RequestStatus, APIRoute, SliceName } from '../../const';
import { getMockFilms } from '../../mocks/data';
import { withStore } from '../../tests/render-helpers';
import { extractActionsTypes } from '../../tests/util';
import { fetchSimilarFilms } from '../../store/async-actions';

import SimilarFilms from './similar-films';

vi.mock('../films', () => ({
  default: vi.fn(() => null)
}));

describe('Component: SimilarFilms (integration)', () => {
  const sliceName = SliceName.SimilarFilms;
  const mockFilm1Id = 'id1';
  const mockFilm2Id = 'id2';
  const mockFilms = getMockFilms(2);

  beforeEach(() => vi.clearAllMocks());

  describe('similar films fetching on component mount', () => {
    it.each([
      [null, RequestStatus.Idle],
      [mockFilm1Id, RequestStatus.Pending],
      [mockFilm1Id, RequestStatus.Success],
      [mockFilm1Id, RequestStatus.Error],
      [mockFilm2Id, RequestStatus.Error],
    ])(
      `should fetch similar films when target film ID mismatch current film ID or loading status is ${RequestStatus.Error} (current film ID: %s, loading status: %s)`,
      (currentFilmId, loadingStatus) => {
        const { withStoreComponent, store, mockAPIAdapter } = withStore(<SimilarFilms filmId={mockFilm2Id} />, {
          [sliceName]: {
            filmId: currentFilmId,
            loadingStatus,
            films: []
          }
        });
        const apiRoute = generatePath(APIRoute.SimilarFilms, { id: mockFilm2Id });
        mockAPIAdapter.onGet(apiRoute).reply(StatusCodes.OK, mockFilms);

        render(withStoreComponent);
        const dispatchedActionsTypes = extractActionsTypes(store.getActions());
        const sliceState = store.getState()[sliceName];

        expect(dispatchedActionsTypes).toEqual([
          fetchSimilarFilms.pending.type
        ]);
        expect(sliceState.loadingStatus).toBe(RequestStatus.Pending);
      }
    );

    it.each([
      RequestStatus.Pending,
      RequestStatus.Success,
    ])(
      'should not fetch similar films when target film ID matches current film ID and loading status is %s',
      (loadingStatus) => {
        const { withStoreComponent, store } = withStore(<SimilarFilms filmId={mockFilm2Id} />, {
          [sliceName]: {
            filmId: mockFilm2Id,
            loadingStatus,
            films: []
          }
        });
        const state = store.getState();

        render(withStoreComponent);
        const dispatchedActions = store.getActions();

        expect(dispatchedActions).toHaveLength(0);
        expect(store.getState()).toEqual(state);
      }
    );
  });

  it('should fetch similar films when filmId prop change', () => {
    const preloadedState = {
      [sliceName]: {
        filmId: mockFilm1Id,
        loadingStatus: RequestStatus.Success,
        films: []
      }
    };
    const { withStoreComponent: withStoreComponent1 } = withStore(
      <SimilarFilms filmId={mockFilm1Id} />, preloadedState
    );
    const { withStoreComponent: withStoreComponent2, store, mockAPIAdapter } = withStore(
      <SimilarFilms filmId={mockFilm2Id} />, preloadedState
    );
    const apiRoute = generatePath(APIRoute.SimilarFilms, { id: mockFilm2Id });
    mockAPIAdapter.onGet(apiRoute).reply(StatusCodes.OK, []);

    const { rerender } = render(withStoreComponent1);
    rerender(withStoreComponent2);
    const dispatchedActionsTypes = extractActionsTypes(store.getActions());
    const sliceState = store.getState()[sliceName];

    expect(dispatchedActionsTypes).toEqual([
      fetchSimilarFilms.pending.type
    ]);
    expect(sliceState).toMatchObject({
      filmId: mockFilm2Id,
      loadingStatus: RequestStatus.Pending
    });
  });

  it('should fetch similar films when user click retry button', async () => {
    const retryButtonText = 'Try again';
    const { withStoreComponent, store, mockAPIAdapter } = withStore(<SimilarFilms filmId={mockFilm2Id} />, {
      [sliceName]: {
        filmId: null,
        loadingStatus: RequestStatus.Idle,
        films: []
      }
    });
    const apiPath = generatePath(APIRoute.SimilarFilms, { id: mockFilm2Id });
    mockAPIAdapter
      .onGet(apiPath).replyOnce(StatusCodes.INTERNAL_SERVER_ERROR)
      .onGet(apiPath).reply(StatusCodes.OK, mockFilms);
    const user = userEvent.setup();

    render(withStoreComponent);
    const retryButtonElement = await screen.findByRole('button', { name: retryButtonText });
    await user.click(retryButtonElement);
    const dispatchedActionsTypes = extractActionsTypes(store.getActions());
    const sliceState = store.getState()[sliceName];

    expect(dispatchedActionsTypes).toEqual([
      fetchSimilarFilms.pending.type,
      fetchSimilarFilms.rejected.type,
      fetchSimilarFilms.pending.type,
      fetchSimilarFilms.fulfilled.type,
    ]);
    expect(sliceState).toMatchObject({
      loadingStatus: RequestStatus.Success,
      films: mockFilms,
    });
  });
});
