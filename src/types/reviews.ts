export type ReviewContent = {
  comment: string;
  rating: number;
}

export type Review = ReviewContent & {
  id: string;
  date: string;
  user: string;
}

export type Reviews = Review[];
