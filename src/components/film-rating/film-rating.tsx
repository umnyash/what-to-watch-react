import { RatingLevel, RatingTreshold } from '../../const';

type FilmRatingProps = {
  rating: number;
  scoresCount: number;
}

function getRatingLevel(rating: number) {
  switch (true) {
    case rating === RatingTreshold[RatingLevel.Awesome]:
      return RatingLevel.Awesome;
    case rating >= RatingTreshold[RatingLevel.VeryGood]:
      return RatingLevel.VeryGood;
    case rating >= RatingTreshold[RatingLevel.Good]:
      return RatingLevel.Good;
    case rating >= RatingTreshold[RatingLevel.Normal]:
      return RatingLevel.Normal;
    default:
      return RatingLevel.Bad;
  }
}

function FilmRating({ rating, scoresCount }: FilmRatingProps): JSX.Element {
  const formatedRating = rating.toLocaleString('ru-RU');

  return (
    <div className="film-rating">
      <div className="film-rating__score">{formatedRating}</div>
      <p className="film-rating__meta">
        <span className="film-rating__level">{getRatingLevel(rating)}</span>
        <span className="film-rating__count">{scoresCount} ratings</span>
      </p>
    </div>
  );
}

export default FilmRating;
