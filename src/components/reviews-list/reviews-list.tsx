import { Reviews } from '../../types/reviews';
import ReviewsItem from '../reviews-item';

const COLUMNS_COUNT = 2;

type ReviewsListProps = {
  reviews: Reviews;
}

function ReviewsList({ reviews }: ReviewsListProps): JSX.Element {
  const firstColumnReviews = reviews.slice(0, Math.ceil(reviews.length / COLUMNS_COUNT));
  const secondColumnReviews = reviews.slice(Math.ceil(reviews.length / COLUMNS_COUNT));

  return (
    <div className="film-card__reviews film-card__row">
      <div className="film-card__reviews-col">
        {firstColumnReviews.map((review) => <ReviewsItem review={review} key={review.id} />)}
      </div>
      <div className="film-card__reviews-col">
        {secondColumnReviews.map((review) => <ReviewsItem review={review} key={review.id} />)}
      </div>
    </div>
  );
}

export default ReviewsList;
