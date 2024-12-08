import { PageFilm } from '../../types/films';
import FilmRating from '../film-rating';

type FilmOverviewProps = {
  film: PageFilm;
}

function FilmOverview({ film }: FilmOverviewProps): JSX.Element {
  const { rating, scoresCount, description, director, starring } = film;

  return (
    <>
      {scoresCount && rating && <FilmRating rating={rating} scoresCount={scoresCount} />}

      <div className="film-card__text">
        <p>{description}</p>
        <p className="film-card__director"><strong>Director: {director}</strong></p>
        <p className="film-card__starring"><strong>Starring: {starring.join(', ')}</strong></p>
      </div>
    </>
  );
}

export default FilmOverview;
