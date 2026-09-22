import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
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
    <form onSubmit={onSubmit}>
      <h1>Register</h1>
      <label>
        Email
        <input type="email" {...register('email', { required: 'Email is required' })} />
      </label>
      {errors.email && <p role="alert">{errors.email.message}</p>}
      <label>
        Password
        <input
          type="password"
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 8, message: 'Password must be at least 8 characters' },
          })}
        />
      </label>
      {errors.password && <p role="alert">{errors.password.message}</p>}
      {registerUser.isError && <p role="alert">{registerUser.error.message}</p>}
      <button type="submit" disabled={registerUser.isPending}>
        {registerUser.isPending ? 'Creating account...' : 'Register'}
      </button>
      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </form>
  );
}
