import { Review } from '../../types/reviews';

type ReviewsItemProps = {
  review: Review;
}

function ReviewsItem({ review }: ReviewsItemProps): JSX.Element {
  const { date, user, comment, rating } = review;
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="review">
      <blockquote className="review__quote">
        <p className="review__text">{comment}</p>

        <footer className="review__details">
          <cite className="review__author">{user}</cite>
          <time className="review__date" dateTime={date}>{formattedDate}</time>
        </footer>
      </blockquote>

      <div className="review__rating">{rating}</div>
    </div>
  );
}

export default ReviewsItem;
