'use client';

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, User, Mail, Building } from 'lucide-react';
import { authClient } from '@/utils/auth-client';

export function UserProfile() {
  const [refreshing, setRefreshing] = useState(false);
  const { useSession } = authClient;
  const { data: session, isPending } = useSession();
 

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isPending) {
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

  if (!session) {
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
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='w-full max-w-md'>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>Perfil do Usuário</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div className='flex items-center space-x-4'>
            <Avatar className='w-16 h-16'>
              
              <AvatarImage src={session.user.image} alt={session.user.name} />
              <AvatarFallback className='text-lg'>
                {getInitials(session.user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className='text-xl font-semibold'>{session.user.name}</h3>
            </div>
          </div>

          <div className='space-y-3'>
            <div className='flex items-center space-x-2'>
              <Mail className='w-4 h-4 text-gray-500' />
              <span className='text-sm'>{session.user.email}</span>
            </div>

            {session.user.name && (
              <div className='flex items-center space-x-2'>
                <Building className='w-4 h-4 text-gray-500' />
                <span className='text-sm'>{session.user.name}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
