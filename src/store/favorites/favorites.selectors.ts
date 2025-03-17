import { State } from '../../types/state';
import { SliceName } from '../../const';

const sliceName = SliceName.Favorites;

const films = (state: State) => state[sliceName].films;
const changingStatusFilmsIds = (state: State) => state[sliceName].changingStatusFilmsIds;

export const favoritesSelectors = {
  films,
  changingStatusFilmsIds,
};
