import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/providers/auth-provider';
import { LoadingSpinner } from '@/components/ui/feedback';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireRole?: string;
  redirectTo?: string;
}

export function RouteGuard({
  children,
  requireAuth = true,
  requireRole,
  redirectTo = '/login',
}: RouteGuardProps) {
  const router = useRouter();
  const { isAuthenticated, role, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    if (requireRole && role !== requireRole) {
      router.push('/unauthorized');
      return;
    }
  }, [
    isAuthenticated,
    role,
    isLoading,
    requireAuth,
    requireRole,
    redirectTo,
    router,
  ]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <LoadingSpinner text='Verificando autenticação...' />
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (requireRole && role !== requireRole) {
    return null;
  }

  return <>{children}</>;
}

interface ProtectedPageProps {
  children: React.ReactNode;
  requireRole?: string;
}

export function ProtectedPage({ children, requireRole }: ProtectedPageProps) {
  return (
    <RouteGuard requireAuth={true} requireRole={requireRole}>
      {children}
    </RouteGuard>
  );
}

interface PublicPageProps {
  children: React.ReactNode;
  redirectIfAuthenticated?: boolean;
  redirectTo?: string;
}

export function PublicPage({
  children,
  redirectIfAuthenticated = false,
  redirectTo = '/fazendas',
}: PublicPageProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (redirectIfAuthenticated && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, redirectIfAuthenticated, redirectTo, router]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <LoadingSpinner text='Carregando...' />
      </div>
    );
  }

  if (redirectIfAuthenticated && isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
