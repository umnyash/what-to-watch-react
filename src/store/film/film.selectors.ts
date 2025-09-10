import { State } from '../../types/state';
import { SliceName, RequestStatus } from '../../const';
import { StatusCodes } from 'http-status-codes';

const sliceName = SliceName.Film;
type SliceState = Pick<State, SliceName.Film>;

const id = (state: SliceState) => state[sliceName].id;
const film = (state: SliceState) => state[sliceName].film;
const isLoading = (state: SliceState) => state[sliceName].loadingStatus === RequestStatus.Pending;
const isLoaded = (state: SliceState) => state[sliceName].loadingStatus === RequestStatus.Success;
const isLoadFailed = (state: SliceState) => state[sliceName].loadingStatus === RequestStatus.Error;

const isNotFound = (state: SliceState): boolean => {
  const error = state[sliceName].error;

  if (!error || typeof error === 'string') {
    return false;
  }

  return error.status === StatusCodes.NOT_FOUND;
};

export const filmSelectors = {
  id,
  film,
  isLoading,
  isLoaded,
  isLoadFailed,
  isNotFound,
};
