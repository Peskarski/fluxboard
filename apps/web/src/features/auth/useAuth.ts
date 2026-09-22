import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, type ApiUser } from '../../lib/api';

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
    mutationFn: (vars: { email: string; password: string }) => api.login(vars.email, vars.password),
    onSuccess: (data: { user: ApiUser }) => {
      queryClient.setQueryData(ME_KEY, data);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: { email: string; password: string }) => api.register(vars.email, vars.password),
    onSuccess: (data: { user: ApiUser }) => {
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
