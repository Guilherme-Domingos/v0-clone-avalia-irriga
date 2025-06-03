'use client';

import { useRouter } from 'next/navigation';
import { AuthenticatedPage } from '@/components/auth/authenticated-page';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { NavBar } from '@/components/nav-bar';
import { PlusIcon, SearchIcon, PencilIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { usePropriedades } from '@/lib/hooks/use-propriedades';
import { useUnidades } from '@/lib/hooks/use-unidades';
import type { Unidade } from '@/app/types';

export default function Areas({ params }: { params: { fazendaId: string } }) {
  const router = useRouter();

  // Buscar dados da propriedade
  const { data: propriedades, isLoading: isLoadingPropriedades } =
    usePropriedades();
  const propriedade = propriedades?.find((p) => p.id === params.fazendaId);

  // Buscar unidades da propriedade
  const {
    data: unidades,
    isLoading: isLoadingUnidades,
    error,
  } = useUnidades(params.fazendaId);
  const handleEditarUnidade = (unidade: Unidade) => {
    if (unidade.tipo === 'setor-hidraulico') {
      router.push(
        `/unidades/${params.fazendaId}/setor-hidraulico/${unidade.id}/editar`
      );
    } else if (unidade.tipo === 'pivo-central') {
      router.push(
        `/unidades/${params.fazendaId}/pivo-central/${unidade.id}/editar`
      );
    }
  };

  const nomePropriedade = propriedade?.nome || 'Propriedade';
  const isLoading = isLoadingPropriedades || isLoadingUnidades;

  if (error) {
    return (
      <AuthenticatedPage>
        <div className='flex flex-col min-h-screen bg-gray-50'>
          <header className='bg-teal-600 text-white p-4 flex justify-between items-center'>
            <h1 className='text-xl font-bold'>Erro</h1>
          </header>
          <main className='flex-1 p-4 flex items-center justify-center'>
            <div className='text-center'>
              <p className='text-gray-600 mb-4'>Erro ao carregar unidades</p>
              <Button onClick={() => window.location.reload()}>
                Tentar Novamente
              </Button>
            </div>
          </main>
          <NavBar activeItem='areas' />
        </div>
      </AuthenticatedPage>
    );
  }

  if (isLoading) {
    return (
      <AuthenticatedPage>
        <div className='flex flex-col min-h-screen bg-gray-50'>
          <header className='bg-teal-600 text-white p-4 flex justify-between items-center'>
            <h1 className='text-xl font-bold'>{nomePropriedade}</h1>
            <Button variant='ghost' size='icon' className='text-white'>
              <SearchIcon className='h-5 w-5' />
            </Button>
          </header>

          <main className='flex-1 p-4 space-y-4'>
            <Button
              className='w-full bg-teal-600 hover:bg-teal-700 text-white rounded-md flex items-center justify-center gap-2 py-6'
              onClick={() =>
                router.push(`/unidades/${params.fazendaId}/selecionar-tipo`)
              }>
              <PlusIcon className='h-5 w-5' />
              <span>Nova Unidade</span>
            </Button>{' '}
            <div className='space-y-3'>
              {isLoading ? (
                // Skeleton loading
                Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index} className='p-4'>
                    <div className='flex justify-between items-center'>
                      <Skeleton className='h-5 w-48' />
                      <Skeleton className='h-8 w-8 rounded' />
                    </div>
                  </Card>
                ))
              ) : unidades && unidades.length > 0 ? (
                unidades.map((unidade) => (
                  <Card
                    key={unidade.id}
                    className='p-4 bg-teal-50 hover:bg-teal-100 transition-colors cursor-pointer'
                    onClick={() => router.push(`/avaliacoes/${unidade.id}`)}>
                    <div className='flex justify-between items-center'>
                      <h3 className='font-medium text-gray-900'>
                        {unidade.nome}
                      </h3>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='text-teal-600'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditarUnidade(unidade);
                        }}>
                        <PencilIcon className='h-5 w-5' />
                      </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <div className='text-center py-8'>
                  <p className='text-gray-500 mb-4'>
                    Nenhuma unidade encontrada
                  </p>
                  <Button
                    onClick={() =>
                      router.push(
                        `/unidades/${params.fazendaId}/selecionar-tipo`
                      )
                    }
                    className='bg-teal-600 hover:bg-teal-700'>
                    <PlusIcon className='h-4 w-4 mr-2' />
                    Criar primeira unidade
                  </Button>
                </div>
              )}
            </div>
          </main>

          <NavBar activeItem='areas' />
        </div>
      </AuthenticatedPage>
    );
  }

  return (
    <AuthenticatedPage>
      <div className='flex flex-col min-h-screen bg-gray-50'>
        <header className='bg-teal-600 text-white p-4 flex justify-between items-center'>
          <h1 className='text-xl font-bold'>{nomePropriedade}</h1>
          <Button variant='ghost' size='icon' className='text-white'>
            <SearchIcon className='h-5 w-5' />
          </Button>
        </header>

        <main className='flex-1 p-4 space-y-4'>
          <Button
            className='w-full bg-teal-600 hover:bg-teal-700 text-white rounded-md flex items-center justify-center gap-2 py-6'
            onClick={() =>
              router.push(`/unidades/${params.fazendaId}/selecionar-tipo`)
            }>
            <PlusIcon className='h-5 w-5' />
            <span>Nova Unidade</span>
          </Button>{' '}
          <div className='space-y-3'>
            {isLoading ? (
              // Skeleton loading
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className='p-4'>
                  <div className='flex justify-between items-center'>
                    <Skeleton className='h-5 w-48' />
                    <Skeleton className='h-8 w-8 rounded' />
                  </div>
                </Card>
              ))
            ) : unidades && unidades.length > 0 ? (
              unidades.map((unidade) => (
                <Card
                  key={unidade.id}
                  className='p-4 bg-teal-50 hover:bg-teal-100 transition-colors cursor-pointer'
                  onClick={() => router.push(`/avaliacoes/${unidade.id}`)}>
                  <div className='flex justify-between items-center'>
                    <h3 className='font-medium text-gray-900'>
                      {unidade.nome}
                    </h3>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='text-teal-600'
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditarUnidade(unidade);
                      }}>
                      <PencilIcon className='h-5 w-5' />
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <div className='text-center py-8'>
                <p className='text-gray-500 mb-4'>Nenhuma unidade encontrada</p>
                <Button
                  onClick={() =>
                    router.push(`/unidades/${params.fazendaId}/selecionar-tipo`)
                  }
                  className='bg-teal-600 hover:bg-teal-700'>
                  <PlusIcon className='h-4 w-4 mr-2' />
                  Criar primeira unidade
                </Button>
              </div>
            )}
          </div>
        </main>

        <NavBar activeItem='areas' />
      </div>
    </AuthenticatedPage>
  );
}
