import { createSelector } from '@reduxjs/toolkit';
import { State } from '../../types/state';
import { SliceName, RequestStatus, ALL_GENRES } from '../../const';
import { groupBy } from '../../util';

const sliceName = SliceName.Catalog;

const films = (state: State) => state[sliceName].films;
const isFilmsLoading = (state: State) => state[sliceName].filmsLoadingStatus === RequestStatus.Pending;
const isFilmsLoaded = (state: State) => state[sliceName].filmsLoadingStatus === RequestStatus.Success;
const isFilmsLoadFailed = (state: State) => state[sliceName].filmsLoadingStatus === RequestStatus.Error;
const genre = (state: State) => state[sliceName].genre;

const filmsGroupedByGenre = createSelector(
  [films],
  (allFilms) => groupBy(allFilms, (film) => film.genre)
);

const filmsByActiveGenre = createSelector(
  [films, filmsGroupedByGenre, genre],
  (allFilms, groupedFilms, activeGenre) => activeGenre === ALL_GENRES
    ? allFilms
    : groupedFilms[activeGenre] ?? []
);

export const catalogSelectors = {
  films,
  isFilmsLoading,
  isFilmsLoaded,
  isFilmsLoadFailed,
  genre,
  filmsGroupedByGenre,
  filmsByActiveGenre,
};
