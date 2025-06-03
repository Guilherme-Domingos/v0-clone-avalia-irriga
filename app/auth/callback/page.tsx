'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setCookie } from 'nookies';
import { jwtDecode } from 'jwt-decode';
import { setBearerToken } from '@/services/api';
import { useAuth } from '@/lib/providers/auth-provider';
import { DecodedToken } from '@/lib/providers/auth-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import toast from 'react-hot-toast';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setIsAuthenticated, setRole, setUserId, setIsAdmin, getUserData } =
    useAuth();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasProcessed = useRef(false);
  useEffect(() => {
    // Evitar execução múltipla
    if (hasProcessed.current) {
      return;
    }

    const token = searchParams.get('token');
    if (!token) {
      setError('Token não encontrado na URL');
      setIsProcessing(false);
      return;
    }
    const processGoogleCallback = async () => {
      try {
        hasProcessed.current = true; // Marcar como processado


        // Verificar se o token é válido decodificando-o
        let decodedToken: DecodedToken;
        try {
          decodedToken = jwtDecode(token);
        } catch (decodeError) {
          console.error('Erro ao decodificar token:', decodeError);
          setError('Token inválido');
          toast.error('Token de autenticação inválido');
          setTimeout(() => router.push('/login'), 2000);
          return;
        } // Verificar se o token não expirou
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp < currentTime) {
          console.error(
            'Token expirado. Exp:',
            decodedToken.exp,
            'Current:',
            currentTime
          );
          setError('Token expirado');
          toast.error('Token de autenticação expirado');
          setTimeout(() => router.push('/login'), 2000);
          return;
        }

        // Armazenar o token como access_token
        setCookie(undefined, 'irriga-ai.accessToken', token, {
          maxAge: 60 * 60 * 24 * 7, // 7 dias
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });

        // TODO: O backend deveria retornar também um refresh_token
        // Por enquanto, vamos usar o mesmo token como refresh_token
        setCookie(undefined, 'irriga-ai.refreshToken', token, {
          maxAge: 60 * 60 * 24 * 30, // 30 dias
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });

        // Configurar o bearer token para as próximas requisições
        setBearerToken(token);

        // Extrair informações do token
        const { role, sub: userId } = decodedToken;
       

        // Atualizar estado de autenticação
        setIsAuthenticated(true);
        setRole(role);
        setUserId(userId);
        setIsAdmin(role === 'ADMIN');
        localStorage.setItem('irriga-ai.session', 'active');
        localStorage.setItem('irriga-ai.session-role', role);

        // Buscar dados completos do usuário
        try {
          await getUserData();
        } catch (userDataError) {
          console.warn(
            'Erro ao carregar dados do usuário, mas continuando com login:',
            userDataError
          );
        }

        // Mostrar sucesso
        toast.success('Login realizado com sucesso!');

        // Redirecionar baseado no role
        if (role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/fazendas'); // ou a página principal do usuário
        }
      } catch (error) {
        console.error('Erro no processamento do callback do Google:', error);
        setError('Erro inesperado durante a autenticação');
        toast.error('Erro na autenticação');
        setTimeout(() => router.push('/login'), 2000);
      } finally {
        setIsProcessing(false);
      }
    };
    processGoogleCallback();
  }, [searchParams, router]); // Removidas as funções do AuthProvider das dependências

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-50'>
        <Card className='p-8 max-w-md w-full mx-4'>
          <div className='text-center'>
            <div className='text-red-500 text-6xl mb-4'>⚠️</div>
            <h1 className='text-xl font-semibold mb-2'>Erro na Autenticação</h1>
            <p className='text-gray-600 mb-4'>{error}</p>
            <p className='text-sm text-gray-500'>
              Redirecionando para a página de login...
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50'>
      <Card className='p-8 max-w-md w-full mx-4'>
        <div className='text-center'>
          <div className='text-teal-600 text-6xl mb-4'>🔄</div>
          <h1 className='text-xl font-semibold mb-4'>Processando Login</h1>
          <p className='text-gray-600 mb-6'>
            Aguarde enquanto finalizamos seu login com o Google...
          </p>

          <div className='space-y-3'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-3/4 mx-auto' />
            <Skeleton className='h-4 w-1/2 mx-auto' />
          </div>

          <div className='mt-6'>
            <div className='inline-flex items-center text-sm text-gray-500'>
              <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-teal-600 mr-2'></div>
              Autenticando...
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
