import { useFilmReviews } from '../../hooks';
import ReviewsList from '../reviews-list';

type ReviewsProps = {
  filmId: string;
}

function Reviews({ filmId }: ReviewsProps): JSX.Element {
  const { data } = useFilmReviews(filmId);

  return <ReviewsList reviews={data} />;
}

export default Reviews;
