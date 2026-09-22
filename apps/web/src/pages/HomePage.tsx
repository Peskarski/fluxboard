import { Box, Typography, Button } from '@mui/material';
import { useCurrentUser, useLogout } from '../features/auth/useAuth';

export function HomePage() {
  const { data } = useCurrentUser();
  const logout = useLogout();

  return (
    <Box sx={{ maxWidth: 360, mx: 'auto', mt: 8, textAlign: 'center' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Fluxboard
      </Typography>
      <Typography sx={{ mb: 2 }}>Logged in as {data?.user.email}</Typography>
      <Button variant="outlined" onClick={() => logout.mutate()}>
        Log out
      </Button>
    </Box>
  );
}
