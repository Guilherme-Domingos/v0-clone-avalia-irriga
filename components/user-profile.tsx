'use client';

import { useAuth } from '@/lib/providers/auth-provider';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, User, Mail, Building } from 'lucide-react';

export function UserProfile() {
  const { userData, getUserData, isLoading } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefreshUserData = async () => {
    setRefreshing(true);
    try {
      await getUserData();
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>Perfil do Usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center space-x-4'>
            <div className='w-16 h-16 bg-gray-200 rounded-full animate-pulse'></div>
            <div className='space-y-2'>
              <div className='h-4 bg-gray-200 rounded animate-pulse w-32'></div>
              <div className='h-4 bg-gray-200 rounded animate-pulse w-48'></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!userData) {
    return (
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>Perfil do Usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-center py-4'>
            <p className='text-gray-500 mb-4'>
              Dados do usuário não carregados
            </p>
            <Button onClick={handleRefreshUserData} disabled={refreshing}>
              {refreshing ? (
                <RefreshCw className='w-4 h-4 mr-2 animate-spin' />
              ) : (
                <RefreshCw className='w-4 h-4 mr-2' />
              )}
              Carregar Dados
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='w-full max-w-md'>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>Perfil do Usuário</CardTitle>
        <Button
          variant='outline'
          size='sm'
          onClick={handleRefreshUserData}
          disabled={refreshing}>
          {refreshing ? (
            <RefreshCw className='w-4 h-4 animate-spin' />
          ) : (
            <RefreshCw className='w-4 h-4' />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div className='flex items-center space-x-4'>
            <Avatar className='w-16 h-16'>
              <AvatarImage src={userData.photo} alt={userData.name} />
              <AvatarFallback className='text-lg'>
                {getInitials(userData.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className='text-xl font-semibold'>{userData.name}</h3>
              <p className='text-gray-500'>ID: {userData.id}</p>
            </div>
          </div>

          <div className='space-y-3'>
            <div className='flex items-center space-x-2'>
              <Mail className='w-4 h-4 text-gray-500' />
              <span className='text-sm'>{userData.email}</span>
            </div>

            {userData.organization && (
              <div className='flex items-center space-x-2'>
                <Building className='w-4 h-4 text-gray-500' />
                <span className='text-sm'>{userData.organization}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
