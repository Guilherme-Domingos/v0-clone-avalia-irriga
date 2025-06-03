import axios, { AxiosError } from 'axios';
import { GetServerSidePropsContext } from 'next';
import { parseCookies, setCookie } from 'nookies';
import { logoutUser } from './api';

interface ISetupApiClient {
  ctx?: GetServerSidePropsContext;
}

export function setupApiClient({ ctx = undefined }: ISetupApiClient) {
  const { 'irriga-ai.accessToken': accessToken } = parseCookies(ctx);
  const isProductionMode = process.env.NODE_ENV === 'production';

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (accessToken) {
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  }

  api.interceptors.request.use(
    (requestConfig) => {
      if (isProductionMode) {
        const { baseURL = '', url } = requestConfig;
        requestConfig.url = url?.replace(baseURL, `${baseURL}/api`);
      }

      return requestConfig;
    },
    (error) => error
  );

  let isRefreshing = false;
  let failedRequests: Array<{
    onSuccess: (token: string) => void;
    onFailure: (err: AxiosError) => void;
  }> = [];

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        const cookies = parseCookies();
        const refreshToken = cookies['irriga-ai.refreshToken'];
        const originalConfig = error.config;

        if (!isRefreshing) {
          isRefreshing = true;

          try {
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}auth/refresh-token`,
              {
                refreshToken,
              }
            );

            const { accessToken, refreshToken: newRefreshToken } = response.data;

            setCookie(undefined, 'irriga-ai.accessToken', accessToken, {
              maxAge: 60 * 15,
              path: '/',
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict',
            });

            setCookie(undefined, 'irriga-ai.refreshToken', newRefreshToken, {
              maxAge: 60 * 60 * 24 * 7,
              path: '/',
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict',
            });

            api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

            failedRequests.forEach((request) => {
              request.onSuccess(accessToken);
            });
            failedRequests = [];

            return api(originalConfig);
          } catch (err) {
            failedRequests.forEach((request) => {
              request.onFailure(err as AxiosError);
            });
            failedRequests = [];

            logoutUser();
            return Promise.reject(err);
          } finally {
            isRefreshing = false;
          }
        }

        return new Promise((resolve, reject) => {
          failedRequests.push({
            onSuccess: (token: string) => {
              originalConfig.headers['Authorization'] = `Bearer ${token}`;
              resolve(api(originalConfig));
            },
            onFailure: (err: AxiosError) => {
              reject(err);
            },
          });
        });
      }

      return Promise.reject(error);
    }
  );

  return api;
}