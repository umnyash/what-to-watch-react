import { State } from '../../types/state';
import { SliceName } from '../../const';

const sliceName = SliceName.SimilarFilms;

const films = (state: State) => state[sliceName].films;

export const similarFilmsSelectors = {
  films,
};
