import { setupTestStore, extractActionsTypes } from '../../tests/util';
import { checkUserAuth, loginUser, fetchFavorites } from '../async-actions';

describe('Middleware: fetchFavoritesOnAuth', () => {
  let store: ReturnType<typeof setupTestStore>['store'];

  beforeEach(() => {
    ({ store } = setupTestStore());
  });

  it.each([
    ['checkUserAuth.fulfilled', checkUserAuth.fulfilled.type],
    ['loginUser.fulfilled', loginUser.fulfilled.type]
  ])(
    'should dispatch fetchFavorites after %s action',
    (_action, actionType) => {
      store.dispatch({ type: actionType });

      const dispatchedActionTypes = extractActionsTypes(store.getActions());

      expect(dispatchedActionTypes).toEqual([
        actionType,
        fetchFavorites.pending.type,
      ]);
    }
  );

  it.each([
    ['checkUserAuth.pending', checkUserAuth.pending.type],
    ['checkUserAuth.rejected', checkUserAuth.rejected.type],
    ['loginUser.pending', loginUser.pending.type],
    ['loginUser.rejected', loginUser.rejected.type],
    ['someOtherAction', 'someOtherActionType']
  ])(
    'should not dispatch fetchFavorites after other actions (%s)',
    (_action, actionType) => {
      store.dispatch({ type: actionType });
      const dispatchedActionTypes = extractActionsTypes(store.getActions());

      expect(dispatchedActionTypes).toEqual([actionType]);
    }
  );
});
