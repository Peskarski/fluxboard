import { useForm } from 'react-hook-form';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Alert, Link } from '@mui/material';
import type { AuthCredentials } from '@fluxboard/shared';
import { useRegister } from '../features/auth/useAuth';

export function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<AuthCredentials>();
  const registerUser = useRegister();
  const navigate = useNavigate();

  const onSubmit = handleSubmit((credentials) => {
    registerUser.mutate(credentials, { onSuccess: () => navigate('/') });
  });

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 360, mx: 'auto', mt: 8 }}
    >
      <Typography variant="h4" component="h1">
        Register
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
        {...register('password', {
          required: 'Password is required',
          minLength: { value: 8, message: 'Password must be at least 8 characters' },
        })}
      />
      {registerUser.isError && <Alert severity="error">{registerUser.error.message}</Alert>}
      <Button type="submit" variant="contained" disabled={registerUser.isPending}>
        {registerUser.isPending ? 'Creating account...' : 'Register'}
      </Button>
      <Typography variant="body2">
        Already have an account? <Link component={RouterLink} to="/login">Log in</Link>
      </Typography>
    </Box>
  );
}
