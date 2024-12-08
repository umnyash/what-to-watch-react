export const FILMS_PER_LOAD = 8;
export const SIMILAR_FILMS_MAX_COUNT = 4;

export const ROUTE_PARAM_ID = ':id';

export enum AppRoute {
  Root = '/',
  Login = '/login',
  MyList = '/mylist',
  Film = `/films/${ROUTE_PARAM_ID}`,
  Review = `/films/${ROUTE_PARAM_ID}/review`,
  Player = `/player/${ROUTE_PARAM_ID}`,
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
