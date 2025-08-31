import { FilmSections, FILM_TABER_ACTIVE_TAB_SEARCH_PARAM } from '../film/const';
import { AppRoute, CommentLength } from '../../const';
import { useState, ChangeEvent, FormEvent } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { reviewSelectors } from '../../store/review/review.selectors';
import { submitReview } from '../../store/async-actions';
import StarsRating from '../stars-rating';

type ReviewFormProps = {
  filmId: string;
}

function ReviewForm({ filmId }: ReviewFormProps): JSX.Element {
  const [formData, setFormData] = useState({
    comment: '',
    rating: 0
  });

  const isSubmitting = useAppSelector(reviewSelectors.isSubmitting);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleFieldChange = (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = evt.target;
    setFormData({ ...formData, [name]: name === 'rating' ? +value : value });
  };

  const handleFormSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    dispatch(submitReview({ filmId, content: formData }))
      .unwrap()
      .then(() => {
        const filmPageRoute = generatePath(AppRoute.Film, { id: filmId });
        const searchParamsForReviewsTab = `?${FILM_TABER_ACTIVE_TAB_SEARCH_PARAM}=${FilmSections.Reviews}`;
        navigate(`${filmPageRoute}${searchParamsForReviewsTab}`);
      })
      .catch(() => { });
  };

  return (
    <form action="#" className="add-review__form" onSubmit={handleFormSubmit}>
      <StarsRating
        value={formData.rating}
        onChange={handleFieldChange}
        disabled={isSubmitting}
      />

      <div className="add-review__text">
        <textarea
          className="add-review__textarea"
          name="comment"
          id="comment"
          placeholder="Review text"
          value={formData.comment}
          onChange={handleFieldChange}
          maxLength={CommentLength.Max}
          disabled={isSubmitting}
        />
        <div className="add-review__submit">
          <button
            className="add-review__btn"
            type="submit"
            disabled={!formData.rating
              || formData.comment.length < CommentLength.Min
              || formData.comment.length > CommentLength.Max
              || isSubmitting}
          >
            Post
          </button>
        </div>
      </div>
    </form>
  );
}

export default ReviewForm;
