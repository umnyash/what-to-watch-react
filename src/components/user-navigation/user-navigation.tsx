import { MouseEvent } from 'react';
import { AuthorizationStatus, AppRoute } from '../../const';
import useAppSelector from '../../hooks/use-app-selector';
import useAppDispatch from '../../hooks/use-app-dispatch';
import { logoutUser } from '../../store/async-actions';
import { Link } from 'react-router-dom';

function UserNavigation(): JSX.Element {
  const authorizationStatus = useAppSelector((state) => state.authorizationStatus);
  const user = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();

  const logoutButtonClickHandler = (evt: MouseEvent<HTMLAnchorElement>) => {
    evt.preventDefault();
    dispatch(logoutUser());
  };

  return (
    <ul className="user-block">
      {authorizationStatus === AuthorizationStatus.Auth && user && (
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

      {authorizationStatus === AuthorizationStatus.NoAuth && (
        <Link className="user-block__link" to={AppRoute.Login}>Sign in</Link>
      )}
    </ul>
  );
}

export default UserNavigation;
