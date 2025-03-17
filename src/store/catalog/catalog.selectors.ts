import { State } from '../../types/state';
import { SliceName, RequestStatus } from '../../const';

const sliceName = SliceName.Catalog;

const films = (state: State) => state[sliceName].films;
const isFilmsLoading = (state: State) => state[sliceName].filmsLoadingStatus === RequestStatus.Pending;
const genre = (state: State) => state[sliceName].genre;

export const catalogSelectors = {
  films,
  isFilmsLoading,
  genre,
};
