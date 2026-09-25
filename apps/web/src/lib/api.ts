import axios, { AxiosError } from 'axios';
import type { AuthCredentials, AuthUser, Board, CreateBoardInput } from '@fluxboard/shared';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error?: string }>) => {
    const message = error.response?.data?.error ?? error.message;
    return Promise.reject(new Error(message));
  },
);

export const api = {
  register: (credentials: AuthCredentials) =>
    apiClient.post<{ user: AuthUser }>('/auth/register', credentials).then((res) => res.data),
  login: (credentials: AuthCredentials) =>
    apiClient.post<{ user: AuthUser }>('/auth/login', credentials).then((res) => res.data),
  logout: () => apiClient.post('/auth/logout').then(() => undefined),
  me: () => apiClient.get<{ user: AuthUser }>('/auth/me').then((res) => res.data),
  listBoards: () => apiClient.get<{ boards: Board[] }>('/boards').then((res) => res.data.boards),
  createBoard: (input: CreateBoardInput) =>
    apiClient.post<{ board: Board }>('/boards', input).then((res) => res.data.board),
  deleteBoard: (id: string) => apiClient.delete(`/boards/${id}`).then(() => undefined),
};
