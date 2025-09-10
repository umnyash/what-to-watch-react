import { createSelector } from '@reduxjs/toolkit';
import { State } from '../../types/state';
import { SliceName, RequestStatus, GENRES_MAX_COUNT } from '../../const';
import { groupBy } from '../../util';

const sliceName = SliceName.Catalog;
type SliceState = Pick<State, SliceName.Catalog>;

const films = (state: SliceState) => state[sliceName].films;
const isFilmsLoading = (state: SliceState) => state[sliceName].filmsLoadingStatus === RequestStatus.Pending;
const isFilmsLoaded = (state: SliceState) => state[sliceName].filmsLoadingStatus === RequestStatus.Success;
const isFilmsLoadFailed = (state: SliceState) => state[sliceName].filmsLoadingStatus === RequestStatus.Error;
const genreFilter = (state: SliceState) => state[sliceName].filter.genre;
const displayedFilmsMaxCount = (state: SliceState) => state[sliceName].displayedFilmsMaxCount;

const filmsGroupedByGenre = createSelector(
  [films],
  (allFilms) => groupBy(allFilms, (film) => film.genre)
);

const filmsFilteredByGenre = createSelector(
  [films, filmsGroupedByGenre, genreFilter],
  (allFilms, groupedFilms, genre) => genre
    ? groupedFilms[genre] ?? []
    : allFilms
);

const displayedFilms = createSelector(
  [filmsFilteredByGenre, displayedFilmsMaxCount],
  (filteredFilms, maxCount) => filteredFilms.slice(0, maxCount)
);

const hasMoreFilms = createSelector(
  [filmsFilteredByGenre, displayedFilmsMaxCount],
  (filteredFilms, maxCount) => filteredFilms.length > maxCount
);

const topGenres = createSelector(
  [filmsGroupedByGenre],
  (groupedFilms) => Object
    .entries(groupedFilms)
    .sort(([, filmsA], [, filmsB]) => filmsB!.length - filmsA!.length)
    .slice(0, GENRES_MAX_COUNT)
    .map(([genre]) => genre)
);

export const catalogSelectors = {
  isFilmsLoading,
  isFilmsLoaded,
  isFilmsLoadFailed,
  genreFilter,
  displayedFilms,
  hasMoreFilms,
  topGenres,
};
