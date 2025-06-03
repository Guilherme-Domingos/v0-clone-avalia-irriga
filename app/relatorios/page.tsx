'use client';

import { useState } from 'react';
import { AuthenticatedPage } from '@/components/auth/authenticated-page';
import { NavBar } from '@/components/nav-bar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { CudChart } from '@/components/cud-chart';
import { usePropriedades } from '@/lib/hooks/use-propriedades';
import { useUnidades } from '@/lib/hooks/use-unidades';
import { useAvaliacoes } from '@/lib/hooks/use-avaliacoes';

export default function Relatorios() {
  const [selectedPropriedade, setSelectedPropriedade] = useState('1');
  const [selectedUnidade, setSelectedUnidade] = useState<string>('');

  // Buscar propriedades
  const { data: propriedades, isLoading: isLoadingPropriedades } =
    usePropriedades();

  // Buscar unidades da propriedade selecionada
  const { data: unidades, isLoading: isLoadingUnidades } =
    useUnidades(selectedPropriedade);

  // Buscar avaliações da unidade selecionada
  const { data: avaliacoes, isLoading: isLoadingAvaliacoes } =
    useAvaliacoes(selectedUnidade);

  const propriedadeSelecionada = propriedades?.find(
    (p) => p.id === selectedPropriedade
  );

  // Processar dados para o gráfico
  const chartData = avaliacoes
    ? {
        labels: avaliacoes.map(
          (av, index) => `Av. ${String(index + 1).padStart(2, '0')}`
        ),
        values: avaliacoes.map(() => Math.floor(Math.random() * 20) + 80), // Simulando CUD entre 80-100%
      }
    : null;
  return (
    <AuthenticatedPage>
      <div className='flex flex-col min-h-screen bg-gray-50'>
        <header className='bg-teal-600 text-white p-4'>
          <h1 className='text-xl font-bold'>
            Relatórios - {propriedadeSelecionada?.nome || 'Carregando...'}
          </h1>
        </header>

        <main className='flex-1 p-4 space-y-6'>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>
                Selecione a propriedade
              </label>
              {isLoadingPropriedades ? (
                <Skeleton className='h-10 w-full' />
              ) : (
                <Select
                  value={selectedPropriedade}
                  onValueChange={setSelectedPropriedade}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Selecione uma propriedade' />
                  </SelectTrigger>
                  <SelectContent>
                    {propriedades?.map((prop) => (
                      <SelectItem key={prop.id} value={prop.id}>
                        {prop.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium'>Selecione a unidade</label>
              {isLoadingUnidades ? (
                <Skeleton className='h-10 w-full' />
              ) : (
                <Select
                  value={selectedUnidade}
                  onValueChange={setSelectedUnidade}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Selecione uma unidade' />
                  </SelectTrigger>
                  <SelectContent>
                    {unidades?.map((unidade) => (
                      <SelectItem key={unidade.id} value={unidade.id}>
                        {unidade.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div className='bg-white p-6 rounded-lg shadow-sm border'>
            <h3 className='text-center font-medium mb-4'>
              Gráfico de Coeficiente de Uniformidade de Distribuição (CUD)
            </h3>
            {isLoadingAvaliacoes ? (
              <div className='space-y-3'>
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-32 w-full' />
                <Skeleton className='h-4 w-3/4 mx-auto' />
              </div>
            ) : chartData ? (
              <CudChart data={chartData} />
            ) : (
              <div className='text-center py-8'>
                <p className='text-gray-500'>
                  {selectedUnidade
                    ? 'Nenhuma avaliação encontrada para esta unidade'
                    : 'Selecione uma unidade para visualizar o relatório'}
                </p>
              </div>
            )}
          </div>
        </main>

        <NavBar activeItem='relatorios' />
      </div>
    </AuthenticatedPage>
  );
}
