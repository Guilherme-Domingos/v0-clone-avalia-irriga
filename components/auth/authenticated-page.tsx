'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/providers/auth-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { Loader2, ShieldX } from 'lucide-react';

interface AuthenticatedPageProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  redirectTo?: string;
}

export function AuthenticatedPage({
  children,
  requiredRoles = [],
  redirectTo = '/login',
}: AuthenticatedPageProps) {
  const { isAuthenticated, role, isLoading, checkSession } = useAuth();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      // Se não está autenticado e não está carregando, verificar sessão
      if (!isAuthenticated && !isLoading) {
        const sessionValid = await checkSession();
        if (!sessionValid) {
          router.replace(redirectTo);
          return;
        }
      }
      setIsInitialized(true);
    };

    initializeAuth();
  }, [isAuthenticated, isLoading, checkSession, router, redirectTo]);

  // Verificar roles se especificadas
  useEffect(() => {
    if (isAuthenticated && role && requiredRoles.length > 0) {
      if (!requiredRoles.includes(role)) {
        // Redirecionar baseado no role do usuário
        if (role === 'ADMIN') {
          router.replace('/admin');
        } else {
          router.replace('/fazendas');
        }
        return;
      }
    }
  }, [isAuthenticated, role, requiredRoles, router]);

  // Mostrar loading enquanto não está inicializado ou está carregando
  if (!isInitialized || isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4'>
        <Card className='p-8 shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm'>
          <div className='flex flex-col items-center space-y-4'>
            <div className='relative'>
              <div className='w-16 h-16 border-4 border-slate-200 dark:border-slate-700 rounded-full'></div>
              <div className='absolute top-0 left-0 w-16 h-16 border-4 border-teal-500 rounded-full border-t-transparent animate-spin'></div>
            </div>
            <div className='flex items-center space-x-2 text-slate-600 dark:text-slate-300'>
              <Loader2 className='w-4 h-4 animate-spin' />
              <span className='text-sm font-medium'>Carregando...</span>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Access denied
  if (requiredRoles.length > 0 && role && !requiredRoles.includes(role)) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 flex items-center justify-center p-4'>
        <Card className='p-8 shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm max-w-md w-full'>
          <div className='text-center space-y-4'>
            <div className='w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center'>
              <ShieldX className='w-8 h-8 text-red-600 dark:text-red-400' />
            </div>
            <div>
              <h1 className='text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2'>
                Acesso Negado
              </h1>
              <p className='text-slate-600 dark:text-slate-400 text-sm'>
                Você não tem permissão para acessar esta página.
              </p>
            </div>
            <div className='flex items-center justify-center space-x-2 text-slate-500 dark:text-slate-400'>
              <Loader2 className='w-4 h-4 animate-spin' />
              <span className='text-sm'>Redirecionando...</span>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
