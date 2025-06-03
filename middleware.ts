import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

type DecodedToken = {
  exp: number;
  iat: number;
  sub: string;
  role: string;
};

// Páginas que requerem autenticação
const protectedPaths = [
  '/fazendas',
  '/perfil',
  '/relatorios',
  '/areas',
  '/avaliacoes',
  '/propriedades',
  '/unidades',
];

// Páginas públicas (não requerem autenticação)
const publicPaths = ['/login', '/cadastro', '/auth/callback', '/logout'];

// Páginas administrativas
const adminPaths = ['/admin'];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar se é uma página pública
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Verificar se é um arquivo estático ou API
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Obter token dos cookies
  const token = request.cookies.get('irriga-ai.accessToken')?.value;

  // Se não há token e está tentando acessar página protegida
  if (!token && protectedPaths.some((path) => pathname.startsWith(path))) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Se há token, verificar se é válido
  if (token) {
    try {
      const decodedToken: DecodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);

      // Verificar se token expirou
      if (decodedToken.exp < currentTime) {
        console.log('Token expirado, redirecionando para login');
        const loginUrl = new URL('/login', request.url);
        const response = NextResponse.redirect(loginUrl);

        // Limpar cookies expirados
        response.cookies.delete('irriga-ai.accessToken');
        response.cookies.delete('irriga-ai.refreshToken');

        return response;
      }

      // Verificar acesso a páginas administrativas
      if (adminPaths.some((path) => pathname.startsWith(path))) {
        if (decodedToken.role !== 'ADMIN') {
          const unauthorizedUrl = new URL('/fazendas', request.url);
          return NextResponse.redirect(unauthorizedUrl);
        }
      }

      // Se usuário está logado e tenta acessar login, redirecionar
      if (pathname === '/login' || pathname === '/') {
        if (decodedToken.role === 'ADMIN') {
          const adminUrl = new URL('/admin', request.url);
          return NextResponse.redirect(adminUrl);
        } else {
          const dashboardUrl = new URL('/fazendas', request.url);
          return NextResponse.redirect(dashboardUrl);
        }
      }
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      // Token inválido, redirecionar para login
      const loginUrl = new URL('/login', request.url);
      const response = NextResponse.redirect(loginUrl);

      // Limpar cookies inválidos
      response.cookies.delete('irriga-ai.accessToken');
      response.cookies.delete('irriga-ai.refreshToken');

      return response;
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
