import { AppRoute, ROUTE_PARAM_ID } from '../../const';
import { CardFilm } from '../../types/films';
import { Link } from 'react-router-dom';

type FilmCardProps = {
  film: CardFilm;
}

function FilmCard({ film }: FilmCardProps): JSX.Element {
  const { id, name, previewImage } = film;
  const link = AppRoute.Film.replace(ROUTE_PARAM_ID, id);

  return (
    <article className="small-film-card catalog__films-card">
      <div className="small-film-card__image">
        <img src={previewImage} width="280" height="175" alt={name} />
      </div>
      <h3 className="small-film-card__title">
        <Link className="small-film-card__link" to={link}>{name}</Link>
      </h3>
    </article>
  );
}

export default FilmCard;
