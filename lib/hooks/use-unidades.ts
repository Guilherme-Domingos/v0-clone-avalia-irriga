import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import toast from 'react-hot-toast';
import type { Unidade, SetorHidraulico, PivoCentral } from '@/app/types';

// Chaves para queries de unidades
export const UNIDADES_KEYS = {
  all: ['unidades'] as const,
  lists: () => [...UNIDADES_KEYS.all, 'list'] as const,
  list: (propriedadeId: string) =>
    [...UNIDADES_KEYS.lists(), { propriedadeId }] as const,
  details: () => [...UNIDADES_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...UNIDADES_KEYS.details(), id] as const,
};

// Hook para buscar unidades de uma propriedade
export function useUnidades(propriedadeId: string) {
  return useQuery({
    queryKey: UNIDADES_KEYS.list(propriedadeId),
    queryFn: async (): Promise<Unidade[]> => {
      // Simulação de dados - em um app real seria uma chamada para o backend
      return [
        {
          id: '1',
          nome: 'Setor Hidráulico 1 - Tomates',
          tipo: 'setor-hidraulico',
          propriedadeId,
        },
        {
          id: '2',
          nome: 'Pivô Central 1 - Laranjas',
          tipo: 'pivo-central',
          propriedadeId,
        },
      ];
    },
    enabled: !!propriedadeId,
  });
}

// Hook para buscar uma unidade específica
export function useUnidade(id: string) {
  return useQuery({
    queryKey: UNIDADES_KEYS.detail(id),
    queryFn: async (): Promise<Unidade | null> => {
      // Simulação - em um app real seria uma chamada para o backend
      const unidades = [
        {
          id: '1',
          nome: 'Setor Hidráulico 1 - Tomates',
          tipo: 'setor-hidraulico',
          propriedadeId: '1',
        },
        {
          id: '2',
          nome: 'Pivô Central 1 - Laranjas',
          tipo: 'pivo-central',
          propriedadeId: '1',
        },
      ];
      //@ts-ignore
      return unidades.find((u) => u.id === id) || null;
    },
    enabled: !!id,
  });
}

// Hook para buscar detalhes de setor hidráulico
export function useSetorHidraulico(id: string) {
  return useQuery({
    queryKey: ['setor-hidraulico', id],
    queryFn: async (): Promise<SetorHidraulico | null> => {
      // Simulação - dados do setor hidráulico
      const setoresSimulados: SetorHidraulico[] = [
        {
          id: '1',
          identificacao: 'Setor Hidráulico 1 - Tomates',
          area: 2.5,
          tipoEmissor: 'Gotejador autocompensante',
          fabricanteEmissor: 'Netafim',
          modeloEmissor: 'UniRam',
          vazaoNominal: 4.0,
          pressaoTrabalho: 1.5,
          distanciaEmissores: 0.3,
          distanciaLinhas: 1.2,
          tipoFiltro: 'Disco',
          malhaFiltro: '120 mesh',
          pressaoEntrada: 2.0,
          tipoValvula: 'Hidráulica',
          tipoEnergia: 'Elétrica trifásica',
          condicoesGerais: 'Boa',
          numeroEmissores: 2500,
          frequenciaManutenção: 'Semanal',
          dataUltimaAvaliacao: '2024-01-15',
          propriedadeId: '1',
        },
      ];
      return setoresSimulados.find((s) => s.id === id) || null;
    },
    enabled: !!id,
  });
}

// Hook para buscar detalhes de pivô central
export function usePivoCentral(id: string) {
  return useQuery({
    queryKey: ['pivo-central', id],
    queryFn: async (): Promise<PivoCentral | null> => {
      // Simulação - dados do pivô central
      const pivosSimulados: PivoCentral[] = [
        {
          id: '2',
          identificacao: 'Pivô Central 1 - Laranjas',
          area: 125.6,
          numeroTorres: 8,
          comprimentoTotal: 400,
          fabricante: 'Valley',
          modelo: '8000 Series',
          tipoEmissao: 'Spray fixo',
          tipoEnergia: 'Elétrica trifásica',
          potenciaMotor: 15,
          vazaoOperacao: 120,
          pressaoOperacao: 2.5,
          tipoControle: 'Automatizado',
          possuiFertirrigacao: true,
          tipoFonteHidrica: 'Poço artesiano',
          tempoFuncionamento: 18,
          velocidadeDeslocamento: 1.2,
          tipoBocal: 'Rotator',
          pressaoBocais: 1.8,
          dataUltimaManutencao: '2024-01-10',
          frequenciaManutencao: 'Quinzenal',
          problemasObservados: 'Pequeno vazamento na torre 3',
          dataUltimaAvaliacao: '2024-01-20',
          propriedadeId: '1',
        },
      ];
      return pivosSimulados.find((p) => p.id === id) || null;
    },
    enabled: !!id,
  });
}

// Hook para criar setor hidráulico
export function useCreateSetorHidraulico() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: Omit<SetorHidraulico, 'id'>
    ): Promise<SetorHidraulico> => {
      // Simulação - em um app real seria uma chamada para o backend
      const newSetor = {
        ...data,
        id: Date.now().toString(),
      };
      return newSetor;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: UNIDADES_KEYS.list(data.propriedadeId),
      });
      toast.success('Setor hidráulico criado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao criar setor hidráulico');
    },
  });
}

// Hook para criar pivô central
export function useCreatePivoCentral() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<PivoCentral, 'id'>): Promise<PivoCentral> => {
      // Simulação - em um app real seria uma chamada para o backend
      const newPivo = {
        ...data,
        id: Date.now().toString(),
      };
      return newPivo;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: UNIDADES_KEYS.list(data.propriedadeId),
      });
      toast.success('Pivô central criado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao criar pivô central');
    },
  });
}

// Hook para atualizar setor hidráulico
export function useUpdateSetorHidraulico() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<SetorHidraulico>;
    }): Promise<SetorHidraulico> => {
      // Simulação - em um app real seria uma chamada para o backend
      return { ...data, id } as SetorHidraulico;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: UNIDADES_KEYS.list(data.propriedadeId),
      });
      queryClient.invalidateQueries({
        queryKey: ['setor-hidraulico', data.id],
      });
      toast.success('Setor hidráulico atualizado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar setor hidráulico');
    },
  });
}

// Hook para atualizar pivô central
export function useUpdatePivoCentral() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<PivoCentral>;
    }): Promise<PivoCentral> => {
      // Simulação - em um app real seria uma chamada para o backend
      return { ...data, id } as PivoCentral;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: UNIDADES_KEYS.list(data.propriedadeId),
      });
      queryClient.invalidateQueries({ queryKey: ['pivo-central', data.id] });
      toast.success('Pivô central atualizado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar pivô central');
    },
  });
}
