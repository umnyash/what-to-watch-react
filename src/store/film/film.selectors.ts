import { State } from '../../types/state';
import { SliceName, RequestStatus } from '../../const';
import { StatusCodes } from 'http-status-codes';

const sliceName = SliceName.Film;

const film = (state: State) => state[sliceName].film;
const isLoading = (state: State) => state[sliceName].loadingStatus === RequestStatus.Pending;
const isLoaded = (state: State) => state[sliceName].loadingStatus === RequestStatus.Success;
const isLoadFailed = (state: State) => state[sliceName].loadingStatus === RequestStatus.Error;

const isNotFound = (state: State): boolean => {
  const error = state[sliceName].error;

  if (!error || typeof error === 'string') {
    return false;
  }

  return error.status === StatusCodes.NOT_FOUND;
};

export const filmSelectors = {
  film,
  isLoading,
  isLoaded,
  isLoadFailed,
  isNotFound,
};
