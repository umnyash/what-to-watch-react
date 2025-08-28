export const FILMS_PER_LOAD = 8;
export const SIMILAR_FILMS_MAX_COUNT = 4;
export const SECONDS_PER_MINUTE = 60;
export const MINUTES_PER_HOUR = 60;
export const GENRES_MAX_COUNT = 9;
export const MAX_RATING = 10;

const ROUTE_PARAM_ID = ':id';
const ROUTE_PARAM_FLAG = ':flag';
export const ERROR_PLACEHOLDER_MESSAGE = 'Something went wrong...';

export enum AppRoute {
  Root = '/',
  Login = '/login',
  MyList = '/mylist',
  Film = `/films/${ROUTE_PARAM_ID}`,
  Review = `/films/${ROUTE_PARAM_ID}/review`,
  Player = `/player/${ROUTE_PARAM_ID}`,
}

export enum APIRoute {
  Login = '/login',
  Logout = '/logout',
  Films = '/films',
  SimilarFilms = `/films/${ROUTE_PARAM_ID}/similar`,
  Film = `/films/${ROUTE_PARAM_ID}`,
  Promo = '/promo',
  Favorites = '/favorite',
  FavoriteStatus = `/favorite/${ROUTE_PARAM_ID}/${ROUTE_PARAM_FLAG}`,
  Reviews = `/comments/${ROUTE_PARAM_ID}`,
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

export enum PageTitle {
  Loading = 'WTW: Loading',
  Main = 'WTW',
  Film = 'WTW: Film',
  Player = 'WTW: Player',
  Login = 'WTW: Sign in',
  MyList = 'WTW: My list',
  Review = 'WTW: Add review',
  NotFound = 'WTW: Page not found',
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

export const CommentLength = {
  Min: 50,
  Max: 400
} as const;

export enum SliceName {
  User = 'USER',
  Catalog = 'CATALOG',
  Film = 'FILM',
  PromoFilm = 'PROMO_FILM',
  SimilarFilms = 'SIMILAR_FILMS',
  Favorites = 'FAVORITES',
  Reviews = 'REVIEWS',
  Review = 'REVIEW',
  Player = 'PLAYER',
}
