import { createSelector } from '@reduxjs/toolkit';
import { State } from '../../types/state';
import { SliceName, SIMILAR_FILMS_MAX_COUNT } from '../../const';
import { getUniqueRandomArrayItems } from '../../util';

const sliceName = SliceName.SimilarFilms;

const filmId = (state: State) => state[sliceName].filmId;
const films = (state: State) => state[sliceName].films;

const someRandomFilms = createSelector(
  [films],
  (allFilms) => getUniqueRandomArrayItems(allFilms, Math.min(allFilms.length, SIMILAR_FILMS_MAX_COUNT))
);

export const similarFilmsSelectors = {
  filmId,
  films,
  someRandomFilms,
};
