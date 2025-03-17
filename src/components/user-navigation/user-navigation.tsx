import { MouseEvent } from 'react';
import { AppRoute } from '../../const';
import useAppSelector from '../../hooks/use-app-selector';
import useAppDispatch from '../../hooks/use-app-dispatch';
import { logoutUser } from '../../store/async-actions';
import { Link, useLocation, Location } from 'react-router-dom';
import { LocationState } from '../../types/location';
import { userSelectors } from '../../store/user/user.selectors';

function UserNavigation(): JSX.Element {
  const isAuth = useAppSelector(userSelectors.isAuth);
  const isNoAuth = useAppSelector(userSelectors.isNoAuth);
  const user = useAppSelector(userSelectors.user);

  const location = useLocation() as Location<LocationState>;

  const dispatch = useAppDispatch();

  const logoutButtonClickHandler = (evt: MouseEvent<HTMLAnchorElement>) => {
    evt.preventDefault();
    dispatch(logoutUser());
  };

  return (
    <ul className="user-block">
      {isAuth && user && (
        <>
          <li className="user-block__item">
            <Link className="user-block__avatar" style={{ display: 'block' }} to={AppRoute.MyList}>
              <img src={user.avatarUrl} alt="User avatar" width="63" height="63" />
            </Link>
          </li>
          <li className="user-block__item">
            <a className="user-block__link" onClick={logoutButtonClickHandler}>Sign out</a>
          </li>
        </>
      )}

      {isNoAuth && (
        <Link
          className="user-block__link"
          to={AppRoute.Login}
          state={{ from: location.pathname }}
        >
          Sign in
        </Link>
      )}
    </ul>
  );
}

export default UserNavigation;
