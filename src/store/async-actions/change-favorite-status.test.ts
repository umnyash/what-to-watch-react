import { generatePath } from 'react-router-dom';
import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';

import { APIRoute, RequestStatus, SliceName } from '../../const';
import { FavoriteStatus } from '../../services/api';
import { getMockFullFilm } from '../../mocks/data';
import { setupTestStore, extractActionsTypes } from '../../tests/util';

import { changeFavoriteStatus } from './change-favorite-status';

vi.mock('react-toastify', () => ({
  toast: {
    warn: vi.fn(),
  }
}));

const getFavoriteStatusPath = ({ filmId, status }: { filmId: string; status: FavoriteStatus }) =>
  generatePath(APIRoute.FavoriteStatus, {
    id: filmId,
    flag: String(status)
  });

describe('Async action: changeFavoriteStatus', () => {
  let store: ReturnType<typeof setupTestStore>['store'];
  let mockAPIAdapter: ReturnType<typeof setupTestStore>['mockAPIAdapter'];
  const favoriteFilm = getMockFullFilm({ isFavorite: true });
  const regularFilm = getMockFullFilm({ isFavorite: false });

  beforeEach(() => {
    ({ store, mockAPIAdapter } = setupTestStore({
      [SliceName.Favorites]: {
        films: [favoriteFilm],
        loadingStatus: RequestStatus.Success,
        changingStatusFilmsIds: [],
      }
    }));

    vi.clearAllMocks();
  });

  it('should call "toast.warn" with error message on network failure', async () => {
    const networkErrorMessage = /Network error/i;
    mockAPIAdapter
      .onPost(generatePath(APIRoute.FavoriteStatus, { id: 'existingFilmId', flag: String(FavoriteStatus.Off) }))
      .networkError();

    await store.dispatch(changeFavoriteStatus({ filmId: 'existingFilmId', status: FavoriteStatus.Off }));

    expect(toast.warn).toHaveBeenCalledTimes(1);
    expect(toast.warn).toHaveBeenCalledWith(expect.stringMatching(networkErrorMessage));
  });

  describe('Server responds with 200 (Ok)', () => {
    const actionArgument = {
      filmId: favoriteFilm.id,
      status: FavoriteStatus.Off,
    };
    const favoriteStatusPath = getFavoriteStatusPath(actionArgument);

    it('should dispatch "changeFavoriteStatus.pending", "changeFavoriteStatus.fulfilled" and return film data when film is removed from favorites', async () => {
      const mockChangedFilm = { ...favoriteFilm, isFavorite: false };
      mockAPIAdapter
        .onPost(favoriteStatusPath)
        .reply(StatusCodes.OK, mockChangedFilm);

      await store.dispatch(changeFavoriteStatus(actionArgument));
      const dispatchedActions = store.getActions();
      const actionsTypes = extractActionsTypes(dispatchedActions);
      const changeFavoriteStatusFulfilled = dispatchedActions[1];

      expect(actionsTypes).toEqual([
        changeFavoriteStatus.pending.type,
        changeFavoriteStatus.fulfilled.type,
      ]);
      expect(changeFavoriteStatusFulfilled.payload).toEqual(mockChangedFilm);
    });
  });

  describe('Server responds with 201 (Created)', () => {
    const actionArgument = {
      filmId: regularFilm.id,
      status: FavoriteStatus.On,
    };
    const favoriteStatusPath = getFavoriteStatusPath(actionArgument);

    it('should dispatch "changeFavoriteStatus.pending", "changeFavoriteStatus.fulfilled" and return film data when film is added to favorites', async () => {
      const mockChangedFilm = { ...regularFilm, isFavorite: true };
      mockAPIAdapter
        .onPost(favoriteStatusPath)
        .reply(StatusCodes.CREATED, mockChangedFilm);

      await store.dispatch(changeFavoriteStatus(actionArgument));
      const dispatchedActions = store.getActions();
      const actionsTypes = extractActionsTypes(dispatchedActions);
      const changeFavoriteStatusFulfilled = dispatchedActions[1];

      expect(actionsTypes).toEqual([
        changeFavoriteStatus.pending.type,
        changeFavoriteStatus.fulfilled.type,
      ]);
      expect(changeFavoriteStatusFulfilled.payload).toEqual(mockChangedFilm);
    });
  });

  describe('Server responds with 400 (Bad Request)', () => {
    const wrongFavoriteStatus = 2;
    const actionArgument = {
      filmId: regularFilm.id,
      status: wrongFavoriteStatus,
    };
    const favoriteStatusPath = getFavoriteStatusPath(actionArgument);

    it('should dispatch "changeFavoriteStatus.pending" and "changeFavoriteStatus.rejected"', async () => {
      mockAPIAdapter
        .onPost(favoriteStatusPath)
        .reply(StatusCodes.BAD_REQUEST);

      await store.dispatch(changeFavoriteStatus(actionArgument));
      const actionsTypes = extractActionsTypes(store.getActions());

      expect(actionsTypes).toEqual([
        changeFavoriteStatus.pending.type,
        changeFavoriteStatus.rejected.type,
      ]);
    });

    it('should call "toast.warn" once with error message', async () => {
      const errorMessage = 'Bad Request';
      mockAPIAdapter
        .onPost(favoriteStatusPath)
        .reply(StatusCodes.BAD_REQUEST, { message: errorMessage });

      await store.dispatch(changeFavoriteStatus(actionArgument));

      expect(toast.warn).toHaveBeenCalledOnce();
      expect(toast.warn).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('Server responds with 401 (Unauthorized)', () => {
    const actionArgument = {
      filmId: regularFilm.id,
      status: FavoriteStatus.On,
    };
    const favoriteStatusPath = getFavoriteStatusPath(actionArgument);

    it('should dispatch "changeFavoriteStatus.pending" and "changeFavoriteStatus.rejected"', async () => {
      mockAPIAdapter
        .onPost(favoriteStatusPath)
        .reply(StatusCodes.UNAUTHORIZED);

      await store.dispatch(changeFavoriteStatus(actionArgument));
      const actionsTypes = extractActionsTypes(store.getActions());

      expect(actionsTypes).toEqual([
        changeFavoriteStatus.pending.type,
        changeFavoriteStatus.rejected.type,
      ]);
    });
  });

  describe('Server responds with 404 (Not Found)', () => {
    const nonExistentFilmId = '0000';
    const actionArgument = {
      filmId: nonExistentFilmId,
      status: FavoriteStatus.On,
    };
    const favoriteStatusPath = getFavoriteStatusPath(actionArgument);

    it('should dispatch "changeFavoriteStatus.pending" and "changeFavoriteStatus.rejected"', async () => {
      mockAPIAdapter
        .onPost(favoriteStatusPath)
        .reply(StatusCodes.NOT_FOUND);

      await store.dispatch(changeFavoriteStatus(actionArgument));
      const actionsTypes = extractActionsTypes(store.getActions());

      expect(actionsTypes).toEqual([
        changeFavoriteStatus.pending.type,
        changeFavoriteStatus.rejected.type,
      ]);
    });

    it('should not call "toast.warn"', async () => {
      mockAPIAdapter
        .onPost(favoriteStatusPath)
        .reply(StatusCodes.NOT_FOUND);

      await store.dispatch(changeFavoriteStatus(actionArgument));

      expect(toast.warn).not.toHaveBeenCalled();
    });
  });

  describe('Server responds with 409 (Conflict)', () => {
    const actionArgument = {
      filmId: regularFilm.id,
      status: FavoriteStatus.Off,
    };
    const favoriteStatusPath = getFavoriteStatusPath(actionArgument);

    it('should dispatch "changeFavoriteStatus.pending" and "changeFavoriteStatus.rejected"', async () => {
      mockAPIAdapter
        .onPost(favoriteStatusPath)
        .reply(StatusCodes.CONFLICT);

      await store.dispatch(changeFavoriteStatus(actionArgument));
      const actionsTypes = extractActionsTypes(store.getActions());

      expect(actionsTypes).toEqual([
        changeFavoriteStatus.pending.type,
        changeFavoriteStatus.rejected.type,
      ]);
    });

    it('should call "toast.warn" once with error message', async () => {
      const errorMessage = 'Conflict';
      mockAPIAdapter
        .onPost(favoriteStatusPath)
        .reply(StatusCodes.CONFLICT, { message: errorMessage });

      await store.dispatch(changeFavoriteStatus(actionArgument));

      expect(toast.warn).toHaveBeenCalledOnce();
      expect(toast.warn).toHaveBeenCalledWith(errorMessage);
    });
  });
});
