type BaseFilm = {
  id: string;
  name: string;
  genre: string;
}

export type CardFilm = BaseFilm & {
  previewImage: string;
  previewVideoLink: string;
}

export type PromoFilm = BaseFilm & {
  posterImage: string;
  backgroundImage: string;
  videoLink: string;
  released: number;
  isFavorite: boolean;
};

export type PageFilm = PromoFilm & {
  backgroundColor: string;
  rating: number;
  description: string;
  scoresCount: number;
  director: string;
  starring: string[];
  runTime: number;
}

export type FullFilm = PageFilm & {
  previewImage: string;
  previewVideoLink: string;
}

export type Films = CardFilm[];
