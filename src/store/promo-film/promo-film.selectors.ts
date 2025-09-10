import { State } from '../../types/state';
import { SliceName, RequestStatus } from '../../const';

const sliceName = SliceName.PromoFilm;
type SliceState = Pick<State, SliceName.PromoFilm>;

const film = (state: SliceState) => state[sliceName].film;
const isLoading = (state: SliceState) => state[sliceName].loadingStatus === RequestStatus.Pending;
const isLoaded = (state: SliceState) => state[sliceName].loadingStatus === RequestStatus.Success;
const isLoadFailed = (state: SliceState) => state[sliceName].loadingStatus === RequestStatus.Error;

export const promoFilmSelectors = {
  film,
  isLoading,
  isLoaded,
  isLoadFailed,
};
