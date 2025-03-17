export const FILMS_PER_LOAD = 8;
export const SIMILAR_FILMS_MAX_COUNT = 4;
export const MINUTES_PER_HOUR = 60;
export const ALL_GENRES = 'all';
export const GENRES_MAX_COUNT = 9;

export const ROUTE_PARAM_ID = ':id';
export const ERROR_PLACEHOLDER_MESSAGE = 'Something went wrong...';

export enum AppRoute {
  Root = '/',
  Login = '/login',
  MyList = '/mylist',
  Film = `/films/${ROUTE_PARAM_ID}`,
  Review = `/films/${ROUTE_PARAM_ID}/review`,
  Player = `/player/${ROUTE_PARAM_ID}`,
}

export enum RequestStatus {
  Idle = 'Idle',
  Pending = 'Pending',
  Success = 'Success',
  Error = 'Error',
}

export enum AuthorizationStatus {
  Auth = 'AUTH',
  NoAuth = 'NO_AUTH',
  Unknown = 'UNKNOWN',
}

export enum RatingLevel {
  Bad = 'Bad',
  Normal = 'Normal',
  Good = 'Good',
  VeryGood = 'Very good',
  Awesome = 'Awesome',
}

export const RatingTreshold = {
  [RatingLevel.Awesome]: 10,
  [RatingLevel.VeryGood]: 8,
  [RatingLevel.Good]: 5,
  [RatingLevel.Normal]: 3,
} as const;

export enum APIRoute {
  Login = '/login',
  Logout = '/logout',
  Films = '/films',
  Promo = '/promo',
  Favorites = '/favorite',
  Reviews = '/comments',
}

export enum FavoriteStatus {
  Off = 0,
  On = 1,
}

export enum SliceName {
  User = 'USER',
  Catalog = 'CATALOG',
  Film = 'FILM',
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
