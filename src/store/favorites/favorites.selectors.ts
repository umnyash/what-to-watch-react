import { State } from '../../types/state';
import { SliceName, RequestStatus } from '../../const';

const sliceName = SliceName.Favorites;
type SliceState = Pick<State, SliceName.Favorites>;

const films = (state: SliceState) => state[sliceName].films;
const isLoading = (state: SliceState) => state[sliceName].loadingStatus === RequestStatus.Pending;
const isLoaded = (state: SliceState) => state[sliceName].loadingStatus === RequestStatus.Success;
const isLoadFailed = (state: SliceState) => state[sliceName].loadingStatus === RequestStatus.Error;
const changingStatusFilmsIds = (state: SliceState) => state[sliceName].changingStatusFilmsIds;

export const favoritesSelectors = {
  films,
  isLoading,
  isLoaded,
  isLoadFailed,
  changingStatusFilmsIds,
};
