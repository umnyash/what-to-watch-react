import { Navigate } from 'react-router-dom';
import { AppRoute } from '../../const';
import useAppSelector from '../../hooks/use-app-selector';
import { selectors } from '../../store/selectors';

type PrivateRouteProps = {
  children: JSX.Element;
}

function PrivateRoute({ children }: PrivateRouteProps): JSX.Element {
  const isAuth = useAppSelector(selectors.isAuth);

  return (
    isAuth
      ? children
      : <Navigate to={AppRoute.Login} />
  );
}

export default PrivateRoute;
