import { createAction } from '@reduxjs/toolkit';
import { Films } from '../types/films';

export const setFilms = createAction<Films>('films/set');
export const setGenre = createAction<string>('filter/setGenre');
