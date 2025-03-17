import { AppRoute, FavoriteStatus } from '../../const';
import useAppSelector from '../../hooks/use-app-selector';
import { userSelectors } from '../../store/user/user.selectors';
import { favoritesSelectors } from '../../store/favorites/favorites.selectors';
import { Link, useLocation, Location } from 'react-router-dom';
import { LocationState } from '../../types/location';
import useAppDispatch from '../../hooks/use-app-dispatch';
import { changeFavoriteStatus } from '../../store/async-actions';

type FavoriteButtonProps = {
  filmId: string;
  isActive: boolean;
}

function FavoriteButton({ filmId, isActive }: FavoriteButtonProps): JSX.Element {
  const isAuth = useAppSelector(userSelectors.isAuth);
  const favorites = useAppSelector(favoritesSelectors.films);
  const isPending = useAppSelector(favoritesSelectors.changingStatusFilmsIds).includes(filmId);
  const location = useLocation() as Location<LocationState>;

  const dispatch = useAppDispatch();

  const handleFavoriteButtonClick = () => {
    dispatch(changeFavoriteStatus({
      filmId,
      status: (isActive) ? FavoriteStatus.Off : FavoriteStatus.On
    }));
  };

  if (isAuth) {
    return (
      <button
        className="btn btn--list film-card__button"
        type="button"
        disabled={isPending}
        onClick={handleFavoriteButtonClick}
      >
        {isActive && (
          <svg viewBox="0 0 18 14" width="18" height="14">
            <use xlinkHref="#in-list" />
          </svg>
        )}

        {!isActive && (
          <svg viewBox="0 0 19 20" width="19" height="20">
            <use xlinkHref="#add" />
          </svg>
        )}

        <span>My list</span>
        <span className="film-card__count">{favorites.length}</span>
      </button>
    );
  }

  return (
    <Link className="btn btn--list film-card__button" state={{ from: location.pathname }} to={AppRoute.Login}>
      <svg viewBox="0 0 19 20" width="19" height="20">
        <use xlinkHref="#add" />
      </svg>
      <span>My list</span>
      <span className="film-card__count">0</span>
    </Link>
  );
}

export default FavoriteButton;
