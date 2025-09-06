import { Action } from 'redux';
import MockAdapter from 'axios-mock-adapter';

import { State } from '../types/state';
import { setupStore, TestStore } from '../store';
import { createAPI } from '../services/api';

export type SetupTestStoreResult = {
  store: TestStore;
  mockAPIAdapter: MockAdapter;
}

export const setupTestStore = (preloadedState?: Partial<State>): SetupTestStoreResult => {
  const api = createAPI();
  const mockAPIAdapter = new MockAdapter(api);
  const store = setupStore({ api, preloadedState, withActionsSpy: true }) as TestStore;

  return { store, mockAPIAdapter };
};

export const extractActionsTypes = (actions: Array<Action<string>>) => actions.map(({ type }) => type);
