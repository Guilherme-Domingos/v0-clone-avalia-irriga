'use client';

import { useEffect } from 'react';
import { authClient } from '@/utils/auth-client';

export default function LogoutPage() {
  useEffect(() => {
    const performLogout = async () => {
      try {
        // Limpar token do localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-token');
        }

        // Fazer logout na API
        await authClient.signOut();
      } catch (error) {
        console.error('Erro no logout:', error);
      } finally {
        // Mesmo se der erro, force o redirecionamento
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    };

    performLogout();
  }, []);

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50'>
      <div className='text-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4'></div>
        <p className='text-gray-600'>Fazendo logout...</p>
      </div>
    </div>
  );
}
