import { Box, Typography, Button } from '@mui/material';
import { useCurrentUser, useLogout } from '../features/auth/useAuth';
import { homeContainerSx, emailTextSx } from './HomePage.styles';

export function HomePage() {
  const { data } = useCurrentUser();
  const logout = useLogout();

  return (
    <Box sx={homeContainerSx}>
      <Typography variant="h4" component="h1" gutterBottom>
        Fluxboard
      </Typography>
      <Typography sx={emailTextSx}>Logged in as {data?.user.email}</Typography>
      <Button variant="outlined" onClick={() => logout.mutate()}>
        Log out
      </Button>
    </Box>
  );
}
