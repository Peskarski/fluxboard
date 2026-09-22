import { Navigate, Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useCurrentUser } from './useAuth';
import { loadingContainerSx } from './ProtectedRoute.styles';

export function ProtectedRoute() {
  const { data, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <Box sx={loadingContainerSx}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data?.user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
