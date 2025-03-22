import { Link, useLocation, Location } from 'react-router-dom';
import { LocationState } from '../../types/location';
import { AppRoute, ROUTE_PARAM_ID } from '../../const';

type PlayerButtonProps = {
  filmId: string;
}

function PlayerButton({ filmId }: PlayerButtonProps) {
  const location = useLocation() as Location<LocationState>;
  const playerPageRoute = AppRoute.Player.replace(ROUTE_PARAM_ID, filmId);

  return (
    <Link className="btn btn--play film-card__button" state={{ from: location.pathname }} to={playerPageRoute}>
      <svg viewBox="0 0 19 19" width="19" height="19">
        <use xlinkHref="#play-s" />
      </svg>
      <span>Play</span>
    </Link>
  );
}

export default PlayerButton;
