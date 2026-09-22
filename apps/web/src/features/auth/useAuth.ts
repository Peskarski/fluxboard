import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AuthCredentials, AuthUser } from '@fluxboard/shared';
import { api } from '../../lib/api';

const ME_KEY = ['me'];

export function useCurrentUser() {
  return useQuery({
    queryKey: ME_KEY,
    queryFn: api.me,
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (credentials: AuthCredentials) => api.login(credentials),
    onSuccess: (data: { user: AuthUser }) => {
      queryClient.setQueryData(ME_KEY, data);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (credentials: AuthCredentials) => api.register(credentials),
    onSuccess: (data: { user: AuthUser }) => {
      queryClient.setQueryData(ME_KEY, data);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.logout,
    onSuccess: () => {
      queryClient.setQueryData(ME_KEY, null);
    },
  });
}
