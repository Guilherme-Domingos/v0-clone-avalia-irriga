'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { NavBar } from '@/components/nav-bar';
import { Input } from '@/components/ui/input';
import { PlusIcon, SearchIcon, PencilIcon } from 'lucide-react';
import { usePropriedades } from '@/lib/hooks/use-propriedades';
import { PageLayout, PageContent } from '@/components/layout/page-layout';
import { LoadingSpinner, EmptyState } from '@/components/ui/feedback';
import { Skeleton } from '@/components/ui/skeleton';
import { AuthenticatedPage } from '@/components/auth/authenticated-page';
import type { PropriedadeAgricola } from '@/app/types';

export default function PropriedadesAgricolas() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: propriedades = [], isLoading, error } = usePropriedades();

  const handleEditarPropriedade = (propriedade: PropriedadeAgricola) => {
    router.push(`/propriedades/${propriedade.id}/editar`);
  };

  const handleVerAreas = (propriedade: PropriedadeAgricola) => {
    router.push(`/areas/${propriedade.id}`);
  };

  // Filtrar propriedades baseado no termo de busca
  const propriedadesFiltradas = propriedades.filter(
    (propriedade) =>
      propriedade.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      propriedade.proprietario
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      propriedade.municipio.toLowerCase().includes(searchTerm.toLowerCase())
  );
  if (error) {
    return (
      <AuthenticatedPage>
        <PageLayout title='Propriedades Agrícolas'>
          <div className='flex flex-col items-center justify-center min-h-[400px]'>
            <div className='text-center'>
              <p className='text-red-600 mb-4'>Erro ao carregar propriedades</p>
              <Button onClick={() => window.location.reload()}>
                Tentar novamente
              </Button>
            </div>
          </div>
          <NavBar activeItem='fazendas' />
        </PageLayout>
      </AuthenticatedPage>
    );
  }
  if (isLoading) {
    return (
      <AuthenticatedPage>
        <PageLayout title='Propriedades Agrícolas'>
          <div className='flex-1 p-4 space-y-4'>
            <Skeleton className='h-16 w-full' />
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className='h-24 w-full' />
            ))}
          </div>
          <NavBar activeItem='fazendas' />
        </PageLayout>
      </AuthenticatedPage>
    );
  }
  return (
    <AuthenticatedPage>
      <PageLayout title='Propriedades Agrícolas'>
        <main className='flex-1 p-4 space-y-4'>
          <div className='mb-4'>
            <Input
              placeholder='Buscar propriedades...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full'
            />
          </div>

          <Button
            className='w-full bg-teal-600 hover:bg-teal-700 text-white rounded-md flex items-center justify-center gap-2 py-6'
            onClick={() => router.push('/propriedades/nova')}>
            <PlusIcon className='h-5 w-5' />
            <span>Nova propriedade agrícola</span>
          </Button>

          {propriedadesFiltradas.length === 0 ? (
            <EmptyState
              title='Nenhuma propriedade encontrada'
              description={
                searchTerm
                  ? 'Tente ajustar os termos de busca ou adicione uma nova propriedade.'
                  : 'Comece adicionando sua primeira propriedade agrícola.'
              }
              action={{
                label: 'Nova Propriedade',
                onClick: () => router.push('/propriedades/nova'),
              }}
            />
          ) : (
            <div className='space-y-3'>
              {propriedadesFiltradas.map((propriedade) => (
                <Card
                  key={propriedade.id}
                  className='p-4 bg-teal-50 hover:bg-teal-100 transition-colors cursor-pointer'
                  onClick={() => handleVerAreas(propriedade)}>
                  <div className='flex justify-between items-start'>
                    <div className='space-y-1'>
                      <h3 className='font-medium text-gray-900'>
                        {propriedade.nome}
                      </h3>
                      <p className='text-sm text-gray-600'>
                        Município: {propriedade.municipio}, {propriedade.estado}
                      </p>
                      <p className='text-sm text-gray-600'>
                        Áreas cadastradas: {propriedade.areasCadastradas}
                      </p>
                    </div>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='text-teal-600'
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditarPropriedade(propriedade);
                      }}>
                      <PencilIcon className='h-5 w-5' />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </main>{' '}
        <NavBar activeItem='fazendas' />
      </PageLayout>
    </AuthenticatedPage>
  );
}
