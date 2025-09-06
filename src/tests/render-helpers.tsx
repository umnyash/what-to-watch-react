import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { MemoryHistory, createMemoryHistory, To } from 'history';
import { HelmetProvider } from 'react-helmet-async';

import { State } from '../types/state';
import { setupTestStore, SetupTestStoreResult } from './util';
import HistoryRouter from './components/history-router';

type HistoryState = {
  from?: string;
}

type WithStoreWrapperResult = SetupTestStoreResult & {
  WithStoreWrapper: (props: { children: ReactNode }) => JSX.Element;
}

type WithStoreResult = SetupTestStoreResult & {
  withStoreComponent: JSX.Element;
}

type WithHistoryResult = {
  withHistoryComponent: JSX.Element;
  history: MemoryHistory;
}

export const withStoreWrapper = (preloadedState?: Partial<State>): WithStoreWrapperResult => {
  const { store, mockAPIAdapter } = setupTestStore(preloadedState);

  const WithStoreWrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  return {
    WithStoreWrapper,
    store,
    mockAPIAdapter,
  };
};

export const withStore = (children: ReactNode, preloadedState?: Partial<State>): WithStoreResult => {
  const { WithStoreWrapper, store, mockAPIAdapter } = withStoreWrapper(preloadedState);
  const withStoreComponent = <WithStoreWrapper>{children}</WithStoreWrapper>;

  return ({
    withStoreComponent,
    store,
    mockAPIAdapter
  });
};

export const withHistory = (children: ReactNode, to?: To, state?: HistoryState): WithHistoryResult => {
  const history = createMemoryHistory();

  if (to) {
    history.push(to, state);
  }

  const withHistoryComponent = (
    <HelmetProvider>
      <HistoryRouter history={history} >
        {children}
      </HistoryRouter>
    </HelmetProvider>
  );

  return {
    withHistoryComponent,
    history,
  };
};
