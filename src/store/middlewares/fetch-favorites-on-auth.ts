import { createListenerMiddleware } from '@reduxjs/toolkit';
import { checkUserAuth, loginUser, fetchFavorites } from '../async-actions';
import { AppDispatch } from '../../types/state';

export const fetchFavoritesOnAuth = createListenerMiddleware();

[checkUserAuth.fulfilled, loginUser.fulfilled].forEach((actionCreator) => {
  fetchFavoritesOnAuth.startListening({
    actionCreator,
    effect: async (_action, { dispatch }) => {
      await (dispatch as AppDispatch)(fetchFavorites());
    }
  });
});
