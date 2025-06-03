import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';
import { destroyCookie, parseCookies } from 'nookies';
import { jwtDecode, JwtPayload } from 'jwt-decode';

import { api } from '../services/api';
import { AuthTokenError } from '@/services/errors/error';

type WithSSRAuthOptions = {
  roles?: string[];
  validateUnitOwnership?: boolean;
  redirectTo?: string;
};

type DecodedToken = JwtPayload & {
  sub: string; // userId
  role: string;
};

export function withSSRAuth<P extends Record<string, any>>(
  fn: GetServerSideProps<P>,
  options?: WithSSRAuthOptions
) {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);
    const accessToken = cookies['irriga-ai.accessToken'];
    const redirectTo = options?.redirectTo || '/login';

    // Se não há token, redirecionar para login
    if (!accessToken) {
      return {
        redirect: {
          destination: redirectTo,
          permanent: false,
        },
      };
    }

    try {
      const decodedToken = jwtDecode<DecodedToken>(accessToken);

      // Verifica se o token está expirado
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp && decodedToken.exp < currentTime) {
        throw new AuthTokenError('Token expirado');
      }
      if (decodedToken.role === 'ADMIN') {
        const authData = {
          role: decodedToken.role,
          userId: decodedToken.sub,
        };

        const result = await fn(ctx);

        if ('props' in result) {
          return {
            props: {
              ...result.props,
              //@ts-ignore
              authData,
            },
          };
        }
        const isDashboard =
          ctx.resolvedUrl.startsWith('/dashboard') ||
          ctx.resolvedUrl.startsWith('/admin');
        if (!isDashboard) {
          ('Redirecting to /dashboard');
          return {
            redirect: {
              destination: '/admin',
              permanent: false,
            },
          };
        }

        return result;
      }

      if (options?.roles) {
        const { roles } = options;
        const userRole = decodedToken.role;
        if (!roles.includes(userRole)) {
          ('Unauthorized Role SSR');
          return {
            redirect: {
              destination: '/unauthorized',
              permanent: false,
            },
          };
        }
      }

      if (options?.validateUnitOwnership) {
      }
      const authData = {
        role: decodedToken.role,
        userId: decodedToken.sub,
      };

      const result = await fn(ctx);

      if ('props' in result) {
        return {
          props: {
            ...result.props,
            //@ts-ignore
            authData,
          },
        };
      }

      return result;
    } catch (err) {
      if (err instanceof AuthTokenError) {
        destroyCookie(ctx, 'irriga-ai.accessToken');
        destroyCookie(ctx, 'irriga-ai.refreshToken');
      }

      return {
        redirect: {
          destination: redirectTo,
          permanent: false,
        },
      };
    }
  };
}
