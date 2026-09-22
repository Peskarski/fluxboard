import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
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
    <form onSubmit={onSubmit}>
      <h1>Log in</h1>
      <label>
        Email
        <input type="email" {...register('email', { required: 'Email is required' })} />
      </label>
      {errors.email && <p role="alert">{errors.email.message}</p>}
      <label>
        Password
        <input type="password" {...register('password', { required: 'Password is required' })} />
      </label>
      {errors.password && <p role="alert">{errors.password.message}</p>}
      {login.isError && <p role="alert">{login.error.message}</p>}
      <button type="submit" disabled={login.isPending}>
        {login.isPending ? 'Logging in...' : 'Log in'}
      </button>
      <p>
        No account? <Link to="/register">Register</Link>
      </p>
    </form>
  );
}
