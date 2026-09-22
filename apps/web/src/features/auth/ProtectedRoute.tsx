import { Navigate, Outlet } from 'react-router-dom';
import { useCurrentUser } from './useAuth';

export function ProtectedRoute() {
  const { data, isLoading } = useCurrentUser();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!data?.user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
