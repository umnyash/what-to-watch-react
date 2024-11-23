import React from 'react';
const MAX_RATING = 10;

function ReviewForm(): JSX.Element {
  return (
    <form action="#" className="add-review__form">
      <div className="rating">
        <div className="rating__stars">
          {Array.from({ length: MAX_RATING }, (_item, index) => {
            const ratingValue = MAX_RATING - index;

            return (
              <React.Fragment key={ratingValue}>
                <input className="rating__input" id={`star-${ratingValue}`} type="radio" name="rating" value={ratingValue} />
                <label className="rating__label" htmlFor={`star-${ratingValue}`}>Rating {ratingValue}</label>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="add-review__text">
        <textarea className="add-review__textarea" name="review-text" id="review-text" placeholder="Review text"></textarea>
        <div className="add-review__submit">
          <button className="add-review__btn" type="submit">Post</button>
        </div>
      </div>
    </form>
  );
}

export default ReviewForm;
