import { createSelector } from '@reduxjs/toolkit';
import { State } from '../../types/state';
import { SliceName, RequestStatus, ALL_GENRES, GENRES_MAX_COUNT } from '../../const';
import { groupBy } from '../../util';

const sliceName = SliceName.Catalog;

const films = (state: State) => state[sliceName].films;
const isFilmsLoading = (state: State) => state[sliceName].filmsLoadingStatus === RequestStatus.Pending;
const isFilmsLoaded = (state: State) => state[sliceName].filmsLoadingStatus === RequestStatus.Success;
const isFilmsLoadFailed = (state: State) => state[sliceName].filmsLoadingStatus === RequestStatus.Error;
const activeGenre = (state: State) => state[sliceName].genre;
const displayedFilmsMaxCount = (state: State) => state[sliceName].displayedFilmsMaxCount;

const filmsGroupedByGenre = createSelector(
  [films],
  (allFilms) => groupBy(allFilms, (film) => film.genre)
);

const filmsByActiveGenre = createSelector(
  [films, filmsGroupedByGenre, activeGenre],
  (allFilms, groupedFilms, genre) => genre === ALL_GENRES
    ? allFilms
    : groupedFilms[genre] ?? []
);

const displayedFilmsByActiveGenre = createSelector(
  [filmsByActiveGenre, displayedFilmsMaxCount],
  (filmsByGenre, maxCount) => filmsByGenre.slice(0, maxCount)
);

const isAllFilmsByActiveGenreDisplayed = createSelector(
  [filmsByActiveGenre, displayedFilmsMaxCount],
  (filmsByGenre, maxCount) => maxCount >= filmsByGenre.length
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
  films,
  isFilmsLoading,
  isFilmsLoaded,
  isFilmsLoadFailed,
  activeGenre,
  displayedFilmsMaxCount,
  filmsGroupedByGenre,
  filmsByActiveGenre,
  displayedFilmsByActiveGenre,
  isAllFilmsByActiveGenreDisplayed,
  topGenres,
};
