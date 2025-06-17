'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { authClient } from '@/utils/auth-client';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const { useSession } = authClient;
  const { data: session } = useSession();

  useEffect(() => {
    // Verificar autenticação via localStorage primeiro (rápido)
    const checkAuth = async () => {
      // Verificar se há token salvo no localStorage
      console.log('Verificando autenticação...');
      console.log('Session:', session);

      const hasToken =
        typeof window !== 'undefined' && localStorage.getItem('auth-token');
      console.log('Token encontrado:', hasToken);
      if (hasToken) {
        setIsAuthenticated(true);
        return;
      }

      // Se não tem token local, depende da sessão
      if (session) {
        // Se temos sessão, salvar token local para agilizar futuras verificações
        console.log('Usuário autenticado via sessão:', session.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth-token', 'authenticated');
        }
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        router.replace('/login');
      }
    };

    checkAuth();
  }, [router, session]);
  console.log('Estado de autenticação:', isAuthenticated);
  // Ainda verificando
  if (isAuthenticated === null) {
    return (
      <div className='flex flex-col min-h-screen bg-gray-50'>
        <header className='bg-teal-600 text-white p-4'>
          <h1 className='text-xl font-bold'>Carregando...</h1>
        </header>
        <main className='flex-1 p-4 flex items-center justify-center'>
          <Card className='p-8'>
            <div className='flex flex-col items-center space-y-4'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600'></div>
              <p className='text-gray-500'>Verificando autenticação...</p>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  // Não autenticado - redirecionamento já foi acionado
  if (!isAuthenticated) {
    return null;
  }

  // Autenticado - mostrar conteúdo
  return <>{children}</>;
}
