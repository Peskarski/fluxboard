import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateBoardInput } from '@fluxboard/shared';
import { api } from '../../lib/api';

const BOARDS_KEY = ['boards'];

export function useBoards() {
  return useQuery({
    queryKey: BOARDS_KEY,
    queryFn: api.listBoards,
  });
}

export function useCreateBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateBoardInput) => api.createBoard(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BOARDS_KEY }),
  });
}

export function useDeleteBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteBoard(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BOARDS_KEY }),
  });
}
