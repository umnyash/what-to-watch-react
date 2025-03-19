import { State } from '../../types/state';
import { SliceName } from '../../const';

const sliceName = SliceName.SimilarFilms;

const filmId = (state: State) => state[sliceName].filmId;
const films = (state: State) => state[sliceName].films;

export const similarFilmsSelectors = {
  filmId,
  films,
};
