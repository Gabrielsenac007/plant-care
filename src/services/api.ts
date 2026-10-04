import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api',
});

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ERR_NETWORK') return 'Não foi possível conectar ao servidor.';
    return error.response?.data?.message ?? 'Ocorreu um erro inesperado.';
  }
  return 'Ocorreu um erro inesperado.';
};
