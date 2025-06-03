'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthenticatedPage } from '@/components/auth/authenticated-page';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft } from 'lucide-react';
import { NavBar } from '@/components/nav-bar';
import type { PropriedadeAgricola } from '@/app/types';

// Lista de estados brasileiros
const estados = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
];

// Tipos de irrigação comuns
const tiposIrrigacao = [
  'Gotejamento',
  'Microaspersão',
  'Aspersão convencional',
  'Pivô central',
  'Sulcos',
  'Inundação',
  'Mangueiras',
  'Outro',
];

// Dados simulados das propriedades (em um app real, viria do backend)
const propriedadesSimuladas: PropriedadeAgricola[] = [
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
    tecnicoResponsavel: 'Ana Pereira',
    telefoneContato: '(88) 98888-8888',
    emailResponsavel: 'maria.santos@email.com',
    municipio: 'Limoeiro do Norte',
    estado: 'CE',
    latitude: '-5.2345',
    longitude: '-38.6789',
    areaTotal: 200,
    areaIrrigada: 180,
    culturasExploradas: ['Banana', 'Mamão'],
    tipoIrrigacao: 'Microaspersão',
    observacoes: '',
    areasCadastradas: 0,
  },
];

export default function EditarPropriedadeAgricola({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [formData, setFormData] = useState<PropriedadeAgricola | null>(null);
  const [culturas, setCulturas] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula busca dos dados da propriedade (em um app real, seria uma chamada para o backend)
    const propriedade = propriedadesSimuladas.find((p) => p.id === params.id);

    if (propriedade) {
      setFormData(propriedade);
      setCulturas(propriedade.culturasExploradas.join(', '));
    }

    setLoading(false);
  }, [params.id]);

  const handleChange = (field: keyof PropriedadeAgricola, value: any) => {
    if (formData) {
      setFormData({
        ...formData,
        [field]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData) return;

    // Aqui seria a integração com o backend para atualizar a propriedade
    console.log('Dados atualizados da propriedade:', formData);

    // Redireciona para a lista de propriedades
    router.push('/fazendas');
  };

  if (loading) {
    return (
      <AuthenticatedPage>
        <div className='flex flex-col min-h-screen bg-gray-50'>
          <header className='bg-teal-600 text-white p-4'>
            <h1 className='text-xl font-bold'>Carregando...</h1>
          </header>
          <div className='flex-1 flex items-center justify-center'>
            <div className='text-center'>
              Carregando dados da propriedade...
            </div>
          </div>
        </div>
      </AuthenticatedPage>
    );
  }

  if (!formData) {
    return (
      <AuthenticatedPage>
        <div className='flex flex-col min-h-screen bg-gray-50'>
          <header className='bg-teal-600 text-white p-4'>
            <h1 className='text-xl font-bold'>Propriedade não encontrada</h1>
          </header>
          <div className='flex-1 flex items-center justify-center'>
            <div className='text-center'>
              <p>Propriedade não encontrada.</p>
              <Button onClick={() => router.push('/fazendas')} className='mt-4'>
                Voltar para propriedades
              </Button>
            </div>
          </div>
        </div>
      </AuthenticatedPage>
    );
  }

  return (
    <AuthenticatedPage>
      <div className='flex flex-col min-h-screen bg-gray-50'>
        <header className='bg-teal-600 text-white p-4'>
          <h1 className='text-xl font-bold'>Editar Propriedade Agrícola</h1>
        </header>

        <div className='p-4'>
          <Button
            variant='ghost'
            className='flex items-center text-gray-700 mb-4'
            onClick={() => router.back()}>
            <ChevronLeft className='h-5 w-5 mr-1' />
            <span>voltar</span>
          </Button>
        </div>

        <main className='flex-1 px-4 pb-16'>
          <Card className='p-6'>
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='space-y-4'>
                <h2 className='text-lg font-medium'>Informações Básicas</h2>

                <div className='space-y-2'>
                  <Label htmlFor='nome'>Nome da propriedade *</Label>
                  <Input
                    id='nome'
                    value={formData.nome}
                    onChange={(e) => handleChange('nome', e.target.value)}
                    required
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='proprietario'>Nome do proprietário *</Label>
                  <Input
                    id='proprietario'
                    value={formData.proprietario}
                    onChange={(e) =>
                      handleChange('proprietario', e.target.value)
                    }
                    required
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='tecnicoResponsavel'>
                    Nome do técnico responsável *
                  </Label>
                  <Input
                    id='tecnicoResponsavel'
                    value={formData.tecnicoResponsavel}
                    onChange={(e) =>
                      handleChange('tecnicoResponsavel', e.target.value)
                    }
                    required
                  />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='telefoneContato'>Telefone de contato</Label>
                    <Input
                      id='telefoneContato'
                      value={formData.telefoneContato}
                      onChange={(e) =>
                        handleChange('telefoneContato', e.target.value)
                      }
                      placeholder='(00) 00000-0000'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='emailResponsavel'>
                      E-mail do responsável
                    </Label>
                    <Input
                      id='emailResponsavel'
                      type='email'
                      value={formData.emailResponsavel}
                      onChange={(e) =>
                        handleChange('emailResponsavel', e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className='space-y-4'>
                <h2 className='text-lg font-medium'>Localização</h2>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='municipio'>Município *</Label>
                    <Input
                      id='municipio'
                      value={formData.municipio}
                      onChange={(e) =>
                        handleChange('municipio', e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='estado'>Estado *</Label>
                    <Select
                      value={formData.estado}
                      onValueChange={(value) => handleChange('estado', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder='Selecione o estado' />
                      </SelectTrigger>
                      <SelectContent>
                        {estados.map((estado) => (
                          <SelectItem key={estado} value={estado}>
                            {estado}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='latitude'>Latitude</Label>
                    <Input
                      id='latitude'
                      value={formData.latitude}
                      onChange={(e) => handleChange('latitude', e.target.value)}
                      placeholder='Ex: -5.1234'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='longitude'>Longitude</Label>
                    <Input
                      id='longitude'
                      value={formData.longitude}
                      onChange={(e) =>
                        handleChange('longitude', e.target.value)
                      }
                      placeholder='Ex: -38.5678'
                    />
                  </div>
                </div>
              </div>

              <div className='space-y-4'>
                <h2 className='text-lg font-medium'>Informações Técnicas</h2>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='areaTotal'>
                      Área total da propriedade (ha) *
                    </Label>
                    <Input
                      id='areaTotal'
                      type='number'
                      min='0'
                      step='0.01'
                      value={formData.areaTotal || ''}
                      onChange={(e) =>
                        handleChange(
                          'areaTotal',
                          Number.parseFloat(e.target.value)
                        )
                      }
                      required
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='areaIrrigada'>
                      Área irrigada total (ha) *
                    </Label>
                    <Input
                      id='areaIrrigada'
                      type='number'
                      min='0'
                      step='0.01'
                      value={formData.areaIrrigada || ''}
                      onChange={(e) =>
                        handleChange(
                          'areaIrrigada',
                          Number.parseFloat(e.target.value)
                        )
                      }
                      required
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='culturas'>Culturas exploradas *</Label>
                  <Input
                    id='culturas'
                    value={culturas}
                    onChange={(e) => {
                      setCulturas(e.target.value);
                      handleChange(
                        'culturasExploradas',
                        e.target.value.split(',').map((c) => c.trim())
                      );
                    }}
                    placeholder='Separe as culturas por vírgula (ex: Tomate, Melão, Banana)'
                    required
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='tipoIrrigacao'>
                    Tipo de irrigação utilizado na propriedade *
                  </Label>
                  <Select
                    value={formData.tipoIrrigacao}
                    onValueChange={(value) =>
                      handleChange('tipoIrrigacao', value)
                    }>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecione o tipo de irrigação' />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposIrrigacao.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='observacoes'>Observações gerais</Label>
                  <Textarea
                    id='observacoes'
                    value={formData.observacoes}
                    onChange={(e) =>
                      handleChange('observacoes', e.target.value)
                    }
                    rows={4}
                    placeholder='Informações adicionais sobre a propriedade'
                  />
                </div>
              </div>

              <div className='pt-4 space-y-3'>
                <Button
                  type='submit'
                  className='w-full bg-teal-600 hover:bg-teal-700 text-white'>
                  Salvar Alterações
                </Button>

                <Button
                  type='button'
                  variant='outline'
                  className='w-full border-red-500 text-red-500 hover:bg-red-50'
                  onClick={() => {
                    if (
                      confirm(
                        'Tem certeza que deseja excluir esta propriedade? Esta ação não pode ser desfeita.'
                      )
                    ) {
                      // Aqui seria a integração com o backend para excluir a propriedade
                      console.log('Excluindo propriedade:', formData.id);
                      router.push('/fazendas');
                    }
                  }}>
                  Excluir Propriedade
                </Button>
              </div>
            </form>
          </Card>
        </main>

        <NavBar activeItem='fazendas' />
      </div>
    </AuthenticatedPage>
  );
}
