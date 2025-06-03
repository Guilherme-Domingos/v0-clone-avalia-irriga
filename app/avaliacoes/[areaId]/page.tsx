'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthenticatedPage } from '@/components/auth/authenticated-page';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { NavBar } from '@/components/nav-bar';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusIcon, PencilIcon, ChevronLeft } from 'lucide-react';
import { useUnidade } from '@/lib/hooks/use-unidades';
import { useAvaliacoes } from '@/lib/hooks/use-avaliacoes';

export default function Avaliacoes({ params }: { params: { areaId: string } }) {
  const router = useRouter();

  // Buscar dados da unidade
  const {
    data: unidade,
    isLoading: isLoadingUnidade,
    error: unidadeError,
  } = useUnidade(params.areaId);

  // Buscar avaliações da unidade
  const {
    data: avaliacoes,
    isLoading: isLoadingAvaliacoes,
    error: avaliacoesError,
  } = useAvaliacoes(params.areaId);
  const handleNovaAvaliacao = () => {
    if (unidade?.tipo === 'pivo-central') {
      router.push(`/avaliacoes/${params.areaId}/pivo-central/nova`);
    } else {
      router.push(`/avaliacoes/${params.areaId}/setor-hidraulico/nova`);
    }
  };

  const isLoading = isLoadingUnidade || isLoadingAvaliacoes;
  const error = unidadeError || avaliacoesError;

  if (error) {
    return (
      <AuthenticatedPage>
        <div className='flex flex-col min-h-screen bg-gray-50'>
          <header className='bg-teal-600 text-white p-4 flex items-center gap-4'>
            <Button variant='ghost' size='icon' className='text-white' asChild>
              <Link href='/fazendas'>
                <ChevronLeft className='h-5 w-5' />
              </Link>
            </Button>
            <h1 className='text-xl font-bold'>Erro</h1>
          </header>
          <main className='flex-1 p-4 flex items-center justify-center'>
            <div className='text-center'>
              <p className='text-gray-600 mb-4'>Erro ao carregar dados</p>
              <Button onClick={() => window.location.reload()}>
                Tentar Novamente
              </Button>
            </div>{' '}
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
          <header className='bg-teal-600 text-white p-4 flex items-center gap-4'>
            <Skeleton className='h-6 w-6 rounded' />
            <Skeleton className='h-6 w-48' />
          </header>
          <div className='p-4'>
            <Skeleton className='h-4 w-20 mb-4' />
          </div>
          <main className='flex-1 px-4 space-y-4'>
            <Skeleton className='h-14 w-full rounded-md' />
            <div className='space-y-3'>
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className='p-4'>
                  <div className='flex justify-between items-center'>
                    <Skeleton className='h-5 w-48' />
                    <Skeleton className='h-8 w-8 rounded' />
                  </div>
                </Card>
              ))}
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
        <header className='bg-teal-600 text-white p-4 flex items-center gap-4'>
          <Button variant='ghost' size='icon' className='text-white' asChild>
            <Link href={`/areas/${unidade?.propriedadeId || '1'}`}>
              <ChevronLeft className='h-5 w-5' />
            </Link>
          </Button>
          <h1 className='text-xl font-bold'>{unidade?.nome || 'Unidade'}</h1>
        </header>

        <main className='flex-1 p-4 space-y-4'>
          <Button
            className='w-full bg-teal-600 hover:bg-teal-700 text-white rounded-md flex items-center justify-center gap-2 py-6'
            onClick={handleNovaAvaliacao}>
            <PlusIcon className='h-5 w-5' />
            <span>Nova avaliação</span>
          </Button>

          <div className='space-y-3'>
            {avaliacoes && avaliacoes.length > 0 ? (
              avaliacoes.map((avaliacao) => (
                <Link
                  href={
                    unidade?.tipo === 'pivo-central'
                      ? `/avaliacoes/${params.areaId}/pivo-central/resultado`
                      : `/avaliacoes/${params.areaId}/${avaliacao.id}`
                  }
                  key={avaliacao.id}>
                  <Card className='p-4 bg-teal-50 hover:bg-teal-100 transition-colors'>
                    <div className='flex justify-between items-center'>
                      <h3 className='font-medium text-gray-900'>
                        {avaliacao.nome} - {avaliacao.data}
                      </h3>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='text-teal-600'>
                        <PencilIcon className='h-5 w-5' />
                      </Button>
                    </div>
                  </Card>
                </Link>
              ))
            ) : (
              <div className='text-center py-8'>
                <p className='text-gray-500 mb-4'>
                  Nenhuma avaliação encontrada
                </p>
                <Button
                  onClick={handleNovaAvaliacao}
                  className='bg-teal-600 hover:bg-teal-700'>
                  <PlusIcon className='h-4 w-4 mr-2' />
                  Criar primeira avaliação
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
