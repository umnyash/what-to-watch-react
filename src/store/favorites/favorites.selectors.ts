import { State } from '../../types/state';
import { SliceName, RequestStatus } from '../../const';

const sliceName = SliceName.Favorites;

const films = (state: State) => state[sliceName].films;
const isLoading = (state: State) => state[sliceName].loadingStatus === RequestStatus.Pending;
const isLoaded = (state: State) => state[sliceName].loadingStatus === RequestStatus.Success;
const isLoadFailed = (state: State) => state[sliceName].loadingStatus === RequestStatus.Error;
const changingStatusFilmsIds = (state: State) => state[sliceName].changingStatusFilmsIds;

export const favoritesSelectors = {
  films,
  isLoading,
  isLoaded,
  isLoadFailed,
  changingStatusFilmsIds,
};
