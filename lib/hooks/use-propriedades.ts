import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import toast from 'react-hot-toast';
import type { PropriedadeAgricola } from '@/app/types';

// Chaves para queries
export const PROPRIEDADES_KEYS = {
  all: ['propriedades'] as const,
  lists: () => [...PROPRIEDADES_KEYS.all, 'list'] as const,
  list: (filters: string) =>
    [...PROPRIEDADES_KEYS.lists(), { filters }] as const,
  details: () => [...PROPRIEDADES_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...PROPRIEDADES_KEYS.details(), id] as const,
};

// Hook para buscar todas as propriedades
export function usePropriedades() {
  return useQuery({
    queryKey: PROPRIEDADES_KEYS.lists(),
    queryFn: async (): Promise<PropriedadeAgricola[]> => {
      // Simulação de dados - em um app real seria uma chamada para o backend
      return [
        {
          id: '1',
          nome: 'Tabuleiro de Russas',
          proprietario: 'João Silva',
          tecnicoResponsavel: 'Carlos Oliveira',
          telefoneContato: '(88) 99999-9999',
          emailResponsavel: 'joao.silva@email.com',
          municipio: 'Russas',
          estado: 'CE',
          latitude: '-5.1234',
          longitude: '-38.5678',
          areaTotal: 150,
          areaIrrigada: 120,
          culturasExploradas: ['Tomate', 'Melão'],
          tipoIrrigacao: 'Gotejamento',
          observacoes: 'Propriedade com boa infraestrutura',
          areasCadastradas: 2,
        },
        {
          id: '2',
          nome: 'Fazenda São José',
          proprietario: 'Maria Santos',
          tecnicoResponsavel: 'Ana Costa',
          telefoneContato: '(85) 88888-8888',
          emailResponsavel: 'maria.santos@email.com',
          municipio: 'Fortaleza',
          estado: 'CE',
          latitude: '-3.7319',
          longitude: '-38.5267',
          areaTotal: 200,
          areaIrrigada: 180,
          culturasExploradas: ['Banana', 'Coco'],
          tipoIrrigacao: 'Aspersão',
          observacoes: 'Propriedade em expansão',
          areasCadastradas: 3,
        },
      ];
    },
  });
}

// Hook para buscar uma propriedade específica
export function usePropriedade(id: string) {
  return useQuery({
    queryKey: PROPRIEDADES_KEYS.detail(id),
    queryFn: async (): Promise<PropriedadeAgricola | null> => {
      // Simulação - em um app real seria uma chamada para o backend
      const propriedades = [
        {
          id: '1',
          nome: 'Tabuleiro de Russas',
          proprietario: 'João Silva',
          tecnicoResponsavel: 'Carlos Oliveira',
          telefoneContato: '(88) 99999-9999',
          emailResponsavel: 'joao.silva@email.com',
          municipio: 'Russas',
          estado: 'CE',
          latitude: '-5.1234',
          longitude: '-38.5678',
          areaTotal: 150,
          areaIrrigada: 120,
          culturasExploradas: ['Tomate', 'Melão'],
          tipoIrrigacao: 'Gotejamento',
          observacoes: 'Propriedade com boa infraestrutura',
          areasCadastradas: 2,
        },
      ];
      return propriedades.find((p) => p.id === id) || null;
    },
    enabled: !!id,
  });
}

// Hook para criar propriedade
export function useCreatePropriedade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: Omit<PropriedadeAgricola, 'id'>
    ): Promise<PropriedadeAgricola> => {
      // Simulação - em um app real seria uma chamada para o backend
      const newPropriedade = {
        ...data,
        id: Date.now().toString(),
      };
      return newPropriedade;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROPRIEDADES_KEYS.lists() });
      toast.success('Propriedade criada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao criar propriedade');
    },
  });
}

// Hook para atualizar propriedade
export function useUpdatePropriedade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<PropriedadeAgricola>;
    }): Promise<PropriedadeAgricola> => {
      // Simulação - em um app real seria uma chamada para o backend
      return { ...data, id } as PropriedadeAgricola;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PROPRIEDADES_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: PROPRIEDADES_KEYS.detail(data.id),
      });
      toast.success('Propriedade atualizada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar propriedade');
    },
  });
}

// Hook para deletar propriedade
export function useDeletePropriedade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      // Simulação - em um app real seria uma chamada para o backend
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROPRIEDADES_KEYS.lists() });
      toast.success('Propriedade excluída com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao excluir propriedade');
    },
  });
}
