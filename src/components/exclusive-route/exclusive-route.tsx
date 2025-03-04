import { Navigate } from 'react-router-dom';
import { AppRoute, AuthorizationStatus } from '../../const';
import useAppSelector from '../../hooks/use-app-selector';
import { selectors } from '../../store/selectors';

type ExclusiveRouteProps = {
  children: JSX.Element;
  onlyFor: AuthorizationStatus;
}

function ExclusiveRoute({ onlyFor, children }: ExclusiveRouteProps): JSX.Element {
  const authorizationStatus = useAppSelector(selectors.authorizationStatus);

  if (authorizationStatus !== onlyFor) {

    switch (onlyFor) {
      case AuthorizationStatus.Auth:
        return <Navigate to={AppRoute.Login} />;

      case AuthorizationStatus.NoAuth:
        return <Navigate to={AppRoute.Root} />;
    }
  }

  return children;
}

export default ExclusiveRoute;
