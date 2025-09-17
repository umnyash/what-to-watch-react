import { useEffect } from 'react';
import { Reviews } from '../../types/reviews';
import { useAppDispatch } from '../use-app-dispatch/use-app-dispatch';
import { useAppSelector } from '../use-app-selector/use-app-selector';
import { reviewsSelectors } from '../../store/reviews/reviews.selectors';
import { fetchReviews } from '../../store/async-actions';

type Result = {
  data: Reviews;
}

export const useFilmReviews = (id: string): Result => {
  const relatedFilmId = useAppSelector(reviewsSelectors.filmId);
  const data = useAppSelector(reviewsSelectors.reviews);
  const isLoading = useAppSelector(reviewsSelectors.isLoading);
  const isLoaded = useAppSelector(reviewsSelectors.isLoaded);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id === relatedFilmId && (isLoading || isLoaded)) {
      return;
    }

    dispatch(fetchReviews(id));

    // The effect loads reviews data on mount or when filmId changes.
    // If the reviews are already loading or loaded, no new request is sent.
    //
    // Excluded from dependencies on purpose:
    // • relatedFilmId, isLoaded — would trigger an extra run when no request is needed (the condition above prevents it).
    // • isLoading — could cause an infinite loop of requests on loading error.
    //
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id]);

  return (id === relatedFilmId) ? { data } : { data: [] };
};
