export const FILMS_PER_LOAD = 8;
export const SIMILAR_FILMS_MAX_COUNT = 4;
export const SECONDS_PER_MINUTE = 60;
export const MINUTES_PER_HOUR = 60;
export const GENRES_MAX_COUNT = 9;
export const MAX_RATING = 10;
export const ERROR_PLACEHOLDER_MESSAGE = 'Something went wrong...';

enum RouteParam {
  Id = ':id',
  Flag = ':flag',
}

export enum AppRoute {
  Root = '/',
  Login = '/login',
  MyList = '/mylist',
  Film = `/films/${RouteParam.Id}`,
  Review = `/films/${RouteParam.Id}/review`,
  Player = `/player/${RouteParam.Id}`,
}

export enum APIRoute {
  Login = '/login',
  Logout = '/logout',
  Films = '/films',
  SimilarFilms = `/films/${RouteParam.Id}/similar`,
  Film = `/films/${RouteParam.Id}`,
  Promo = '/promo',
  Favorites = '/favorite',
  FavoriteStatus = `/favorite/${RouteParam.Id}/${RouteParam.Flag}`,
  Reviews = `/comments/${RouteParam.Id}`,
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
