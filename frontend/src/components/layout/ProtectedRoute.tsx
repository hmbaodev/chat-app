import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../../hooks/useAuth';

export default function ProtectedRoute() {
  const { currentUser, isInitializing } = useAuth();

  if (isInitializing) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/sign-in" replace />;
  }

  return <Outlet />;
}
