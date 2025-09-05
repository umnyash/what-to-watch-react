import { configureStore, Middleware, AnyAction } from '@reduxjs/toolkit';
import { rootReducer } from './root-reducer';
import { createAPI, isApiError } from '../services/api';
import { fetchFavoritesOnAuth } from './middlewares/fetch-favorites-on-auth';

interface WithActionsSpy {
  getActions(): Array<AnyAction>;
}

type AppStore = ReturnType<typeof setupStore>;
export type TestStore = AppStore & WithActionsSpy;

type SetupStoreOptions = {
  api?: ReturnType<typeof createAPI>;
  preloadedState?: Partial<ReturnType<typeof rootReducer>>;
  withActionsSpy?: boolean;
};

const createActionsSpy = () => {
  const actions: AnyAction[] = [];

  const middleware: Middleware = () => (next) => (action: AnyAction): AnyAction => {
    actions.push(action);
    return next(action);
  };

  const get = () => [...actions];

  return { middleware, get };
};

export const setupStore = ({
  api = createAPI(),
  preloadedState,
  withActionsSpy,
}: SetupStoreOptions = {}) => {
  const actionsSpy = withActionsSpy && createActionsSpy();

  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: { api, isApiError },
        },
      })
        .concat(fetchFavoritesOnAuth.middleware)
        .concat(actionsSpy ? [actionsSpy.middleware] : []),
  });

  return actionsSpy
    ? Object.assign(store, { getActions: actionsSpy.get })
    : store;
};

export const store = setupStore();
