import { Link, useLocation, Location, generatePath } from 'react-router-dom';
import { LocationState } from '../../types/location';
import { AppRoute } from '../../const';

type PlayerButtonProps = {
  filmId: string;
}

function PlayerButton({ filmId }: PlayerButtonProps) {
  const location = useLocation() as Location<LocationState>;
  const playerPageRoute = generatePath(AppRoute.Player, { id: filmId });

  return (
    <Link className="btn btn--play film-card__button" state={{ from: location.pathname }} to={playerPageRoute}>
      <svg viewBox="0 0 19 19" width="19" height="19">
        <use href="#play-s" />
      </svg>
      <span>Play</span>
    </Link>
  );
}

export default PlayerButton;
