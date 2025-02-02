import { createAction } from '@reduxjs/toolkit';
import { User } from '../types/user';
import { Films } from '../types/films';
import { AuthorizationStatus } from '../const';

export const setAuthorizationStatus = createAction<AuthorizationStatus>('user/setAuthorizationStatus');
export const setUser = createAction<User>('user/set');

export const setFilms = createAction<Films>('films/set');
export const setFilmsLoadingStatus = createAction<boolean>('films/setLoadingStatus');

export const setGenre = createAction<string>('filter/setGenre');
