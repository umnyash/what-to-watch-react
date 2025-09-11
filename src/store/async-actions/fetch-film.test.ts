import { generatePath } from 'react-router-dom';
import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';

import { APIRoute } from '../../const';
import { UNEXPECTED_ERROR } from '../../services/api';
import { getMockPageFilm } from '../../mocks/data';
import { setupTestStore, extractActionsTypes } from '../../tests/util';

import { fetchFilm } from './fetch-film';

vi.mock('react-toastify', () => ({
  toast: {
    warn: vi.fn(),
  }
}));

describe('Async action: fetchFilm', () => {
  let store: ReturnType<typeof setupTestStore>['store'];
  let mockAPIAdapter: ReturnType<typeof setupTestStore>['mockAPIAdapter'];
  const mockFilm = getMockPageFilm();

  beforeEach(() => {
    ({ store, mockAPIAdapter } = setupTestStore());
    vi.clearAllMocks();
  });

  it('should call "toast.warn" with error message on network failure', async () => {
    const networkErrorMessage = /Network error/i;
    mockAPIAdapter
      .onGet(generatePath(APIRoute.Film, { id: mockFilm.id }))
      .networkError();

    await store.dispatch(fetchFilm(mockFilm.id));

    expect(toast.warn).toHaveBeenCalledTimes(1);
    expect(toast.warn).toHaveBeenCalledWith(expect.stringMatching(networkErrorMessage));
  });

  describe('Server responds with 200 (Ok)', () => {
    it('should dispatch "fetchFilm.pending", "fetchFilm.fulfilled" and return film data', async () => {
      mockAPIAdapter
        .onGet(generatePath(APIRoute.Film, { id: mockFilm.id }))
        .reply(StatusCodes.OK, mockFilm);

      await store.dispatch(fetchFilm(mockFilm.id));
      const dispatchedActions = store.getActions();
      const actionsTypes = extractActionsTypes(dispatchedActions);
      const fetchFilmFulfilled = dispatchedActions[1];

      expect(actionsTypes).toEqual([
        fetchFilm.pending.type,
        fetchFilm.fulfilled.type,
      ]);
      expect(fetchFilmFulfilled.payload).toEqual(mockFilm);
    });
  });

  describe('Server responds with 404 (Not Found)', () => {
    const nonExistentFilmId = '0000';

    it('should dispatch "fetchFilm.pending", "fetchFilm.rejected" and return error status code when server responds with 404', async () => {
      mockAPIAdapter
        .onGet(generatePath(APIRoute.Film, { id: nonExistentFilmId }))
        .reply(StatusCodes.NOT_FOUND);

      await store.dispatch(fetchFilm(nonExistentFilmId));
      const dispatchedActions = store.getActions();
      const actionsTypes = extractActionsTypes(dispatchedActions);
      const fetchFilmRejected = dispatchedActions[1];

      expect(actionsTypes).toEqual([
        fetchFilm.pending.type,
        fetchFilm.rejected.type,
      ]);
      expect(fetchFilmRejected.payload).toEqual({ status: StatusCodes.NOT_FOUND });
    });

    it('should not call "toast.warn"', async () => {
      mockAPIAdapter
        .onGet(generatePath(APIRoute.Film, { id: nonExistentFilmId }))
        .reply(StatusCodes.NOT_FOUND);

      await store.dispatch(fetchFilm(nonExistentFilmId));

      expect(toast.warn).not.toHaveBeenCalled();
    });
  });

  it('should dispatch "fetchFilm.pending", "fetchFilm.rejected" and return unexpected error for non-API errors', async () => {
    mockAPIAdapter
      .onGet(generatePath(APIRoute.Film, { id: mockFilm.id }))
      .reply(() => {
        throw new Error('Meow!');
      });

    await store.dispatch(fetchFilm(mockFilm.id));
    const dispatchedActions = store.getActions();
    const actionsTypes = extractActionsTypes(dispatchedActions);
    const fetchFilmRejected = dispatchedActions[1];

    expect(actionsTypes).toEqual([
      fetchFilm.pending.type,
      fetchFilm.rejected.type,
    ]);
    expect(fetchFilmRejected.payload).toEqual(UNEXPECTED_ERROR);
  });
});
