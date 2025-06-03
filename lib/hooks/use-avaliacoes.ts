import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import toast from 'react-hot-toast';

interface Avaliacao {
  id: string;
  nome: string;
  data: string;
  unidadeId: string;
  tipo: 'setor-hidraulico' | 'pivo-central';
}

interface AvaliacaoDetalhada extends Avaliacao {
  pontosAvaliados?: { [key: string]: boolean };
  comentarios?: Array<{
    id: string;
    texto: string;
    imagem?: string;
  }>;
  dadosPivo?: any;
  volumes?: any[];
  resultados?: any;
}

// Chaves para queries de avaliações
export const AVALIACOES_KEYS = {
  all: ['avaliacoes'] as const,
  lists: () => [...AVALIACOES_KEYS.all, 'list'] as const,
  list: (unidadeId: string) =>
    [...AVALIACOES_KEYS.lists(), { unidadeId }] as const,
  details: () => [...AVALIACOES_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...AVALIACOES_KEYS.details(), id] as const,
};

// Hook para buscar avaliações de uma unidade
export function useAvaliacoes(unidadeId: string) {
  return useQuery({
    queryKey: AVALIACOES_KEYS.list(unidadeId),
    queryFn: async (): Promise<Avaliacao[]> => {
      // Simulação de dados - em um app real seria uma chamada para o backend
      return [
        {
          id: '1',
          nome: 'Avaliação 01',
          data: '01/01/2020',
          unidadeId,
          tipo: 'setor-hidraulico',
        },
        {
          id: '2',
          nome: 'Avaliação 02',
          data: '05/05/2020',
          unidadeId,
          tipo: 'setor-hidraulico',
        },
      ];
    },
    enabled: !!unidadeId,
  });
}

// Hook para buscar uma avaliação específica
export function useAvaliacao(id: string) {
  return useQuery({
    queryKey: AVALIACOES_KEYS.detail(id),
    queryFn: async (): Promise<AvaliacaoDetalhada | null> => {
      // Simulação - em um app real seria uma chamada para o backend
      const avaliacoes: AvaliacaoDetalhada[] = [
        {
          id: '1',
          nome: 'Avaliação 01',
          data: '01/01/2020',
          unidadeId: '1',
          tipo: 'setor-hidraulico',
          pontosAvaliados: {
            '2-2': true,
            '2-3': true,
            '3-0': true,
          },
          comentarios: [
            {
              id: '1',
              texto: 'Gotejamento no ponto X está entupido. Trocar filtro',
              imagem: '/placeholder.svg?height=100&width=200',
            },
          ],
        },
      ];
      return avaliacoes.find((a) => a.id === id) || null;
    },
    enabled: !!id,
  });
}

// Hook para criar avaliação
export function useCreateAvaliacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: Omit<AvaliacaoDetalhada, 'id'>
    ): Promise<AvaliacaoDetalhada> => {
      // Simulação - em um app real seria uma chamada para o backend
      const newAvaliacao = {
        ...data,
        id: Date.now().toString(),
      };
      return newAvaliacao;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: AVALIACOES_KEYS.list(data.unidadeId),
      });
      toast.success('Avaliação criada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao criar avaliação');
    },
  });
}

// Hook para atualizar avaliação
export function useUpdateAvaliacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<AvaliacaoDetalhada>;
    }): Promise<AvaliacaoDetalhada> => {
      // Simulação - em um app real seria uma chamada para o backend
      return { ...data, id } as AvaliacaoDetalhada;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: AVALIACOES_KEYS.list(data.unidadeId),
      });
      queryClient.invalidateQueries({
        queryKey: AVALIACOES_KEYS.detail(data.id),
      });
      toast.success('Avaliação atualizada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar avaliação');
    },
  });
}

// Hook para deletar avaliação
export function useDeleteAvaliacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      // Simulação - em um app real seria uma chamada para o backend
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AVALIACOES_KEYS.lists() });
      toast.success('Avaliação excluída com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao excluir avaliação');
    },
  });
}
