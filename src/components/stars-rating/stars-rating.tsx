import { Fragment, ChangeEvent } from 'react';
import { MAX_RATING } from '../../const';

type StarsRatingProps = {
  value: number;
  onChange: (evt: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

function StarsRating({ value, onChange, disabled }: StarsRatingProps): JSX.Element {
  return (
    <div className="rating">
      <div className="rating__stars" data-testid="rating-stars">
        {Array.from({ length: MAX_RATING }, (_item, index) => {
          const ratingValue = (MAX_RATING - index);

          return (
            <Fragment key={ratingValue}>
              <input
                className="rating__input"
                id={`star-${ratingValue}`}
                type="radio" name="rating"
                value={ratingValue}
                checked={value === ratingValue}
                disabled={disabled}
                onChange={onChange}
              />
              <label className="rating__label" htmlFor={`star-${ratingValue}`}>Rating {ratingValue}</label>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default StarsRating;
