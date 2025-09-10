import { createSelector } from '@reduxjs/toolkit';
import { State } from '../../types/state';
import { RequestStatus, SliceName, SIMILAR_FILMS_MAX_COUNT } from '../../const';
import { getUniqueRandomArrayItems } from '../../util';

const sliceName = SliceName.SimilarFilms;
type SliceState = Pick<State, SliceName.SimilarFilms>;

const filmId = (state: SliceState) => state[sliceName].filmId;
const isLoading = (state: SliceState) => state[sliceName].loadingStatus === RequestStatus.Pending;
const isLoaded = (state: SliceState) => state[sliceName].loadingStatus === RequestStatus.Success;
const isLoadFailed = (state: SliceState) => state[sliceName].loadingStatus === RequestStatus.Error;
const films = (state: SliceState) => state[sliceName].films;

const someRandomFilms = createSelector(
  [films],
  (allFilms) => getUniqueRandomArrayItems(allFilms, Math.min(allFilms.length, SIMILAR_FILMS_MAX_COUNT))
);

export const similarFilmsSelectors = {
  filmId,
  isLoading,
  isLoaded,
  isLoadFailed,
  someRandomFilms,
};
