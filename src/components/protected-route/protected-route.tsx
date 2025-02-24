import { Navigate, useLocation } from 'react-router-dom';
import { getUserData, isAuthChecked } from '../../services/slices/userSlice';
import { useSelector } from '../../services/store';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  component: React.JSX.Element;
};

export const ProtectedRoute = ({
  onlyUnAuth = true,
  component
}: ProtectedRouteProps): React.JSX.Element => {
  const user = useSelector(getUserData);
  const AuthChecked = useSelector(isAuthChecked);
  const location = useLocation();

  if (!AuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    // маршрут для авторизованного, но не авторизован
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    // маршрут для неавторизованного, но авторизован
    const { from } = location.state ?? { from: { pathname: '/' } };
    return <Navigate replace to={from} />;
  }

  // onlyUnAuth && !user для неавторизованного и неавторизован
  // !onlyUnAuth && user для авторизованного и авторизован

  return component;
};

export const OnlyUnAuth = ProtectedRoute;

export const OnlyAuth = ({ component }: { component: React.JSX.Element }) => (
  <ProtectedRoute onlyUnAuth={false} component={component} />
);
