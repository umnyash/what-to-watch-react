import { createSelector } from '@reduxjs/toolkit';
import { State } from '../../types/state';
import { SliceName, RequestStatus, GENRES_MAX_COUNT } from '../../const';
import { groupBy } from '../../util';

const sliceName = SliceName.Catalog;

const films = (state: State) => state[sliceName].films;
const isFilmsLoading = (state: State) => state[sliceName].filmsLoadingStatus === RequestStatus.Pending;
const isFilmsLoaded = (state: State) => state[sliceName].filmsLoadingStatus === RequestStatus.Success;
const isFilmsLoadFailed = (state: State) => state[sliceName].filmsLoadingStatus === RequestStatus.Error;
const genreFilter = (state: State) => state[sliceName].filter.genre;
const displayedFilmsMaxCount = (state: State) => state[sliceName].displayedFilmsMaxCount;

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
