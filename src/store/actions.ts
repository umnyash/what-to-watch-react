import { createAction } from '@reduxjs/toolkit';

export const setGenre = createAction<string>('filter/setGenre');
export const clearLoginErrorData = createAction('user/setLoggingInErrorMessage');
