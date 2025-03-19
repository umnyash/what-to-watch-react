import { useEffect } from 'react';
import useAppDispatch from '../../hooks/use-app-dispatch';
import useAppSelector from '../../hooks/use-app-selector';
import { reviewsSelectors } from '../../store/reviews/reviews.selector';
import ReviewsList from '../reviews-list';
import { fetchReviews } from '../../store/async-actions';

type ReviewsProps = {
  filmId: string;
}

function Reviews({ filmId }: ReviewsProps): JSX.Element {
  const dispatch = useAppDispatch();
  const currentReviews = useAppSelector(reviewsSelectors.reviews);
  const currentReviewsFilmId = useAppSelector(reviewsSelectors.filmId);

  useEffect(() => {
    if (currentReviewsFilmId === filmId) {
      return;
    }

    dispatch(fetchReviews(filmId));
  }, [filmId, currentReviewsFilmId, dispatch]);

  return <ReviewsList reviews={currentReviews} />;
}

export default Reviews;
