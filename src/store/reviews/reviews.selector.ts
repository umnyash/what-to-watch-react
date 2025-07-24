import { State } from '../../types/state';
import { SliceName } from '../../const';

const sliceName = SliceName.Reviews;

const filmId = (state: State) => state[sliceName].filmId;
const reviews = (state: State) => state[sliceName].reviews;

export const reviewsSelectors = {
  filmId,
  reviews,
};
