import { State } from '../../types/state';
import { SliceName, RequestStatus } from '../../const';

const sliceName = SliceName.PromoFilm;

const film = (state: State) => state[sliceName].film;
const isLoading = (state: State) => state[sliceName].loadingStatus === RequestStatus.Pending;
const isLoaded = (state: State) => state[sliceName].loadingStatus === RequestStatus.Success;
const isLoadFailed = (state: State) => state[sliceName].loadingStatus === RequestStatus.Error;

export const promoFilmSelectors = {
  film,
  isLoading,
  isLoaded,
  isLoadFailed,
};
