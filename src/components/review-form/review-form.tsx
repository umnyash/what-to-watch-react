import { FilmSections, FILM_TABER_ACTIVE_TAB_SEARCH_PARAM } from '../../pages/film-page/const';
import { AppRoute, ROUTE_PARAM_ID } from '../../const';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import useAppDispatch from '../../hooks/use-app-dispatch';
import useAppSelector from '../../hooks/use-app-selector';
import { reviewsSelectors } from '../../store/reviews/reviews.selector';
import { submitReview } from '../../store/async-actions';

const MAX_RATING = 10;
const CommentLength = {
  Min: 50,
  Max: 400
} as const;

type ReviewFormProps = {
  filmId: string;
}

function ReviewForm({ filmId }: ReviewFormProps): JSX.Element {
  const [formData, setFormData] = useState({
    comment: '',
    rating: 0
  });

  const isReviewSumbitting = useAppSelector(reviewsSelectors.isReviewSubmitting);

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
        const searchParamsForReviewsTab = `?${FILM_TABER_ACTIVE_TAB_SEARCH_PARAM}=${FilmSections.Reviews}`;
        navigate(`${AppRoute.Film.replace(ROUTE_PARAM_ID, filmId)}${searchParamsForReviewsTab}`);
      })
      .catch(() => { });
  };

  return (
    <form action="#" className="add-review__form" onSubmit={handleFormSubmit}>
      <div className="rating">
        <div className="rating__stars">
          {Array.from({ length: MAX_RATING }, (_item, index) => {
            const ratingValue = (MAX_RATING - index);

            return (
              <React.Fragment key={ratingValue}>
                <input
                  className="rating__input"
                  id={`star-${ratingValue}`}
                  type="radio" name="rating"
                  value={ratingValue}
                  checked={formData.rating === ratingValue}
                  disabled={isReviewSumbitting}
                  onChange={handleFieldChange}
                />
                <label className="rating__label" htmlFor={`star-${ratingValue}`}>Rating {ratingValue}</label>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="add-review__text">
        <textarea
          className="add-review__textarea"
          name="comment"
          id="comment"
          placeholder="Review text"
          value={formData.comment}
          onChange={handleFieldChange}
          maxLength={CommentLength.Max}
          disabled={isReviewSumbitting}
        />
        <div className="add-review__submit">
          <button
            className="add-review__btn"
            type="submit"
            disabled={!formData.rating
              || formData.comment.length < CommentLength.Min
              || formData.comment.length > CommentLength.Max
              || isReviewSumbitting}
          >
            Post
          </button>
        </div>
      </div>
    </form>
  );
}

export default ReviewForm;
