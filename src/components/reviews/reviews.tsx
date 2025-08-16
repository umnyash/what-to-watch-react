import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { reviewsSelectors } from '../../store/reviews/reviews.selectors';
import ReviewsList from '../reviews-list';
import { fetchReviews } from '../../store/async-actions';

type ReviewsProps = {
  filmId: string;
}

function Reviews({ filmId }: ReviewsProps): JSX.Element {
  const dispatch = useAppDispatch();
  const currentReviewsFilmId = useAppSelector(reviewsSelectors.filmId);
  const currentReviews = useAppSelector(reviewsSelectors.reviews);
  const isLoading = useAppSelector(reviewsSelectors.isLoading);
  const isLoaded = useAppSelector(reviewsSelectors.isLoaded);

  const reviews = currentReviewsFilmId === filmId
    ? currentReviews
    : [];

  useEffect(() => {
    if (currentReviewsFilmId === filmId && (isLoading || isLoaded)) {
      return;
    }

    dispatch(fetchReviews(filmId));

    // The effect loads reviews data on mount or when filmId changes.
    // If the reviews are already loading or loaded, no new request is sent.
    //
    // Excluded from dependencies on purpose:
    // • currentReviewsFilmId, isLoaded — would trigger an extra run when no request is needed (the condition above prevents it).
    // • isLoading — could cause an infinite loop of requests on loading error.
    //
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filmId, dispatch]);

  return <ReviewsList reviews={reviews} />;
}

export default Reviews;
