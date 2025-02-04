import { createAction } from '@reduxjs/toolkit';
import { User } from '../types/user';
import { Films, FilmState } from '../types/films';
import { Reviews } from '../types/reviews';

import { AuthorizationStatus } from '../const';

export const setAuthorizationStatus = createAction<AuthorizationStatus>('user/setAuthorizationStatus');
export const setUser = createAction<User>('user/set');

export const setFilms = createAction<Films>('films/set');
export const setFilmsLoadingStatus = createAction<boolean>('films/setLoadingStatus');

export const setFilm = createAction<FilmState>('film/set');
export const setFilmLoadingStatus = createAction<boolean>('film/setLoadingStatus');

export const setReviews = createAction<Reviews>('reviews/set');

export const setGenre = createAction<string>('filter/setGenre');
