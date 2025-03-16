import useAppSelector from '../../hooks/use-app-selector';
import { PromoFilm } from '../../types/films';
import { Link } from 'react-router-dom';
import { AppRoute, ROUTE_PARAM_ID } from '../../const';
import { selectors } from '../../store/selectors';
import FavoriteButton from '../favorite-button';

type FilmHeaderProps = {
  film: PromoFilm;
}

function FilmHeader({ film }: FilmHeaderProps): JSX.Element {
  const isAuth = useAppSelector(selectors.isAuth);
  const { id, name, genre, released, isFavorite } = film;
  const reviewPageRoute = AppRoute.Review.replace(ROUTE_PARAM_ID, id);
  const playerPageRoute = AppRoute.Player.replace(ROUTE_PARAM_ID, id);

  return (
    <div className="film-card__desc">
      <h2 className="film-card__title">{name}</h2>
      <p className="film-card__meta">
        <span className="film-card__genre">{genre}</span>
        <span className="film-card__year">{released}</span>
      </p>

      <div className="film-card__buttons">
        <Link className="btn btn--play film-card__button" to={playerPageRoute}>
          <svg viewBox="0 0 19 19" width="19" height="19">
            <use xlinkHref="#play-s" />
          </svg>
          <span>Play</span>
        </Link>
        <FavoriteButton filmId={id} isActive={isFavorite} />

        {isAuth && (
          <Link to={reviewPageRoute} className="btn film-card__button">Add review</Link>
        )}
      </div>
    </div>
  );
}

export default FilmHeader;
