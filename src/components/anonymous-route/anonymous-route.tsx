import { Navigate } from 'react-router-dom';
import { AppRoute } from '../../const';
import useAppSelector from '../../hooks/use-app-selector';
import { selectors } from '../../store/selectors';

type PrivateRouteProps = {
  children: JSX.Element;
}

function AnonymousRoute({ children }: PrivateRouteProps): JSX.Element {
  const isNoAuth = useAppSelector(selectors.isNoAuth);

  return (
    isNoAuth
      ? children
      : <Navigate to={AppRoute.Root} />
  );
}

export default AnonymousRoute;
