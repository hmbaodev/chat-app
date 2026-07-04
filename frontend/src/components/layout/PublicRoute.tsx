import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../../hooks/useAuth';

export default function PublicRoute() {
  const { currentUser, isInitializing } = useAuth();

  if (isInitializing) {
    return <div>Loading...</div>;
  }

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
