import { selectIsAuthChecked, selectUser } from '@selectors';
import { Preloader } from '@ui';
import { Navigate } from 'react-router-dom';

import { useTypedLocation } from '@hooks/useTypedLocation';
import { useSelector } from '@services/store';

import type { ReactNode } from 'react';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: ReactNode;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children,
}: TProtectedRouteProps): React.JSX.Element => {
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const location = useTypedLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from?.pathname ?? '/';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};
