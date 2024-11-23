import React, { useState, ChangeEvent } from 'react';

const MAX_RATING = 10;
const CommentLength = {
  Min: 50,
  Max: 400
} as const;

function ReviewForm(): JSX.Element {
  const [formData, setFormData] = useState({
    comment: '',
    rating: 0
  });

  const handleFieldChange = (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = evt.target;
    setFormData({ ...formData, [name]: name === 'rating' ? +value : value });
  };

  return (
    <form action="#" className="add-review__form">
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
        />
        <div className="add-review__submit">
          <button
            className="add-review__btn"
            type="submit"
            disabled={!formData.rating
              || formData.comment.length < CommentLength.Min
              || formData.comment.length > CommentLength.Max}
          >
            Post
          </button>
        </div>
      </div>
    </form>
  );
}

export default ReviewForm;
