export const BACKEND_URL = 'https://16.design.htmlacademy.pro/wtw';
export const REQUEST_TIMEOUT = 5000;

export enum FavoriteStatus {
  Off = 0,
  On = 1,
}

export const loginResponseErrorDetailMessages = {
  email: {
    required: 'email should not be empty',
    pattern: 'email must be an email',
  },
  password: {
    required: 'password should not be empty',
    pattern: 'Password no have letter or number!',
    minLength: 'password must be longer than or equal to 2 characters',
  },
} as const;
