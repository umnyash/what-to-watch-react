import { PageFilm } from '../../types/films';
import { MINUTES_PER_HOUR } from '../../const';
import clsx from 'clsx';

type FilmDetailsProps = {
  film: PageFilm;
}

function getFormattedRunTime(minutes: number) {
  const hoursCount = Math.floor(minutes / MINUTES_PER_HOUR);
  const minutesCount = minutes % MINUTES_PER_HOUR;

  const formattedRunTime = clsx(
    hoursCount && `${hoursCount}h`,
    `${minutesCount}m`
  );

  return formattedRunTime;
}

function FilmDetails({ film }: FilmDetailsProps): JSX.Element {
  const { director, starring, runTime, genre, released } = film;

  const formattedRunTime = getFormattedRunTime(runTime);

  return (
    <div className="film-card__text film-card__row">
      <div className="film-card__text-col">
        <p className="film-card__details-item">
          <strong className="film-card__details-name">Director</strong>
          <span className="film-card__details-value">{director}</span>
        </p>
        <p className="film-card__details-item">
          <strong className="film-card__details-name">Starring</strong>
          <span className="film-card__details-value">
            {starring.map((item, index) => (index === starring.length - 1)
              ? item
              : <>{item}, <br /></>)}
          </span>
        </p>
      </div>
      <div className="film-card__text-col">
        <p className="film-card__details-item">
          <strong className="film-card__details-name">Run Time</strong>
          <span className="film-card__details-value">{formattedRunTime}</span>
        </p>
        <p className="film-card__details-item">
          <strong className="film-card__details-name">Genre</strong>
          <span className="film-card__details-value">{genre}</span>
        </p>
        <p className="film-card__details-item">
          <strong className="film-card__details-name">Released</strong>
          <span className="film-card__details-value">{released}</span>
        </p>
      </div>
    </div>
  );
}

export default FilmDetails;
