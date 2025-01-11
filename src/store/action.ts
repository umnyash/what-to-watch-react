import { createAction } from '@reduxjs/toolkit';
import { Films } from '../types/films';

export const setFilms = createAction<Films>('catalog/setFilms');
export const setGenre = createAction<string>('catalog/setGenre');
