import api from './api';
import type { PropriedadeAgricola } from '@/app/types';

export interface CreatePropriedadeData {
  nome: string;
  proprietario: string;
  municipio: string;
  estado: string;
  endereco?: string;
  telefone?: string;
  email?: string;
  tecnicoResponsavel?: string;
}

export interface UpdatePropriedadeData extends Partial<CreatePropriedadeData> {
  id: string;
}

class PropriedadeService {
  private baseUrl = '/propriedades';

  async getAll(): Promise<PropriedadeAgricola[]> {
    try {
      const response = await api.get<PropriedadeAgricola[]>(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar propriedades:', error);
      throw new Error('Não foi possível carregar as propriedades');
    }
  }

  async getById(id: string): Promise<PropriedadeAgricola> {
    try {
      const response = await api.get<PropriedadeAgricola>(
        `${this.baseUrl}/${id}`
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar propriedade:', error);
      throw new Error('Não foi possível carregar a propriedade');
    }
  }

  async create(data: CreatePropriedadeData): Promise<PropriedadeAgricola> {
    try {
      const response = await api.post<PropriedadeAgricola>(this.baseUrl, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar propriedade:', error);
      throw new Error('Não foi possível criar a propriedade');
    }
  }

  async update(data: UpdatePropriedadeData): Promise<PropriedadeAgricola> {
    try {
      const { id, ...updateData } = data;
      const response = await api.put<PropriedadeAgricola>(
        `${this.baseUrl}/${id}`,
        updateData
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar propriedade:', error);
      throw new Error('Não foi possível atualizar a propriedade');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('Erro ao deletar propriedade:', error);
      throw new Error('Não foi possível deletar a propriedade');
    }
  }
}

export const propriedadeService = new PropriedadeService();
