import { useCurrentUser, useLogout } from '../features/auth/useAuth';

export function HomePage() {
  const { data } = useCurrentUser();
  const logout = useLogout();

  return (
    <div>
      <h1>Fluxboard</h1>
      <p>Logged in as {data?.user.email}</p>
      <button onClick={() => logout.mutate()}>Log out</button>
    </div>
  );
}
