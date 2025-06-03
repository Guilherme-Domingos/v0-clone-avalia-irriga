'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { NavBar } from '@/components/nav-bar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/lib/providers/auth-provider';
import toast from 'react-hot-toast';
import { AuthenticatedPage } from '@/components/auth/authenticated-page';

export default function Perfil() {
  const router = useRouter();
  const { logout, isLoading, userData, getUserData } = useAuth();

  // Estado do usuário baseado nos dados do AuthProvider
  const [user, setUser] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    organization: userData?.organization || '',
  });

  const [isUpdating, setIsUpdating] = useState(false);

  // Efeito para atualizar o estado local quando userData mudar
  useEffect(() => {
    if (userData) {
      setUser({
        name: userData.name || '',
        email: userData.email || '',
        organization: userData.organization || '',
      });
    }
  }, [userData]);

  // Buscar dados do usuário quando o componente montar
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userData) {
        await getUserData();
      }
    };
    fetchUserData();
  }, [userData, getUserData]);
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      // Simulação de atualização - em um app real seria uma chamada para API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar perfil');
    } finally {
      setIsUpdating(false);
    }
  };
  const handleLogout = async () => {
    try {
      // Usar a rota dedicada de logout para garantir que funcione
      if (typeof window !== 'undefined') {
        window.location.href = '/logout';
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  // Mostrar skeleton enquanto carrega os dados do usuário
  if (isLoading || !userData) {
    return (
      <AuthenticatedPage>
        <div className='flex flex-col min-h-screen bg-gray-50'>
          <header className='bg-teal-600 text-white p-4'>
            <Skeleton className='h-6 w-32' />
          </header>
          <main className='flex-1 p-4 space-y-6'>
            <div className='flex flex-col items-center justify-center mb-6'>
              <Skeleton className='h-24 w-24 rounded-full' />
              <Skeleton className='h-6 w-32 mt-4' />
              <Skeleton className='h-4 w-48 mt-2' />
            </div>
            <Card className='p-4'>
              <div className='space-y-4'>
                <Skeleton className='h-10 w-full' />
                <Skeleton className='h-10 w-full' />
                <Skeleton className='h-10 w-full' />
                <Skeleton className='h-10 w-full' />
              </div>
            </Card>
          </main>
          <NavBar activeItem='perfil' />
        </div>
      </AuthenticatedPage>
    );
  }

  return (
    <AuthenticatedPage>
      <div className='flex flex-col min-h-screen bg-gray-50'>
        <header className='bg-teal-600 text-white p-4'>
          <h1 className='text-xl font-bold'>Perfil</h1>
        </header>

        <main className='flex-1 p-4 space-y-6'>
          {' '}
          <div className='flex flex-col items-center justify-center mb-6'>
            <Avatar className='h-24 w-24'>
              <AvatarImage
                src={userData.photo || '/placeholder.svg?height=96&width=96'}
                alt={userData.name}
              />
              <AvatarFallback className='text-2xl bg-teal-100 text-teal-600'>
                {userData.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <h2 className='mt-4 text-xl font-semibold'>{userData.name}</h2>
            <p className='text-gray-600'>{userData.email}</p>
          </div>
          <Card className='p-4'>
            <form onSubmit={handleSaveProfile} className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Nome</Label>
                <Input
                  id='name'
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  disabled={isUpdating}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  disabled={isUpdating}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='organization'>Organização</Label>
                <Input
                  id='organization'
                  value={user.organization}
                  onChange={(e) =>
                    setUser({ ...user, organization: e.target.value })
                  }
                  disabled={isUpdating}
                />
              </div>

              <Button
                type='submit'
                className='w-full bg-teal-600 hover:bg-teal-700 text-white'
                disabled={isUpdating}>
                {isUpdating ? 'Salvando...' : 'Salvar alterações'}
              </Button>
            </form>
          </Card>
          <Button
            variant='outline'
            className='w-full border-red-500 text-red-500 hover:bg-red-50'
            onClick={handleLogout}
            disabled={isUpdating}>
            Sair
          </Button>
        </main>

        <NavBar activeItem='perfil' />
      </div>
    </AuthenticatedPage>
  );
}
