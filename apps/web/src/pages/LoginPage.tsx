import { useForm } from 'react-hook-form';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Alert, Link } from '@mui/material';
import type { AuthCredentials } from '@fluxboard/shared';
import { useLogin } from '../features/auth/useAuth';

export function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<AuthCredentials>();
  const login = useLogin();
  const navigate = useNavigate();

  const onSubmit = handleSubmit((credentials) => {
    login.mutate(credentials, { onSuccess: () => navigate('/') });
  });

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 360, mx: 'auto', mt: 8 }}
    >
      <Typography variant="h4" component="h1">
        Log in
      </Typography>
      <TextField
        label="Email"
        type="email"
        error={!!errors.email}
        helperText={errors.email?.message}
        {...register('email', { required: 'Email is required' })}
      />
      <TextField
        label="Password"
        type="password"
        error={!!errors.password}
        helperText={errors.password?.message}
        {...register('password', { required: 'Password is required' })}
      />
      {login.isError && <Alert severity="error">{login.error.message}</Alert>}
      <Button type="submit" variant="contained" disabled={login.isPending}>
        {login.isPending ? 'Logging in...' : 'Log in'}
      </Button>
      <Typography variant="body2">
        No account? <Link component={RouterLink} to="/register">Register</Link>
      </Typography>
    </Box>
  );
}
