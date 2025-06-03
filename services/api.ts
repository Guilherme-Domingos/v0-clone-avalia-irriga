import axios from 'axios';
import { parseCookies, destroyCookie } from 'nookies';
import Router from 'next/router';
import { setupApiClient } from './setupApiClient';

export const api = setupApiClient({ ctx: undefined });

export function setBearerToken(token: string) {
  api.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : '';
}

// Configurando interceptor para adicionar token em todas as requisições
api.interceptors.request.use((config) => {
  const { 'irriga-ai.accessToken': token } = parseCookies();

  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !error.config.url.includes('/auth/refresh-token') &&
      !error.config.url.includes('/auth/login')
    ) {
      // if (typeof window !== 'undefined') {
      //   window.location.href = '/';
      // }
    }

    return Promise.reject(error);
  }
);

export const logoutUser = () => {
  destroyCookie(undefined, 'irriga-ai.accessToken');
  destroyCookie(undefined, 'irriga-ai.refreshToken');
  Router.push('/');
};

export default api;
