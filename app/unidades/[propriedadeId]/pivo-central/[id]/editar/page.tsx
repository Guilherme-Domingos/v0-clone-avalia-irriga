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
import { Switch } from '@/components/ui/switch';
import { ChevronLeft } from 'lucide-react';
import { NavBar } from '@/components/nav-bar';
import type { PivoCentral } from '@/app/types';

// Tipos de emissão
const tiposEmissao = [
  'Spray fixo',
  'Spray rotativo',
  'Difusor',
  'I-Wob',
  'LDN',
  'Super Spray',
  'Outro',
];

// Tipos de energia
const tiposEnergia = [
  'Elétrica monofásica',
  'Elétrica trifásica',
  'Diesel',
  'Solar',
  'Outro',
];

// Tipos de controle
const tiposControle = [
  'Manual',
  'Automático',
  'Remoto',
  'Computadorizado',
  'Outro',
];

// Tipos de fonte hídrica
const tiposFonteHidrica = [
  'Rio',
  'Açude',
  'Poço',
  'Barragem',
  'Canal',
  'Outro',
];

// Tipos de bocal
const tiposBocal = ['Fixo', 'Regulável', 'Rotativo', 'Outro'];

// Frequências de manutenção
const frequenciasManutenção = [
  'Mensal',
  'Trimestral',
  'Semestral',
  'Anual',
  'Outro',
];

// Dados simulados dos pivôs centrais
const pivosSimulados: PivoCentral[] = [
  {
    id: '2',
    identificacao: 'Pivô Central 1 - Laranjas',
    area: 125.6,
    numeroTorres: 8,
    comprimentoTotal: 400,
    fabricante: 'Valley',
    modelo: '8000 Series',
    tipoEmissao: 'Spray rotativo',
    tipoEnergia: 'Elétrica trifásica',
    potenciaMotor: 75,
    vazaoOperacao: 180,
    pressaoOperacao: 25,
    tipoControle: 'Automático',
    possuiFertirrigacao: true,
    tipoFonteHidrica: 'Poço',
    tempoFuncionamento: 18,
    velocidadeDeslocamento: 85,
    tipoBocal: 'Regulável',
    pressaoBocais: 15,
    dataUltimaManutencao: '2024-01-10',
    frequenciaManutencao: 'Trimestral',
    problemasObservados: 'Pequeno vazamento na torre 3',
    dataUltimaAvaliacao: '2024-01-20',
    propriedadeId: '1',
  },
];

export default function EditarPivoCentral({
  params,
}: {
  params: { propriedadeId: string; id: string };
}) {
  const router = useRouter();
  const [formData, setFormData] = useState<PivoCentral | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula busca dos dados do pivô central (em um app real, seria uma chamada para o backend)
    const pivo = pivosSimulados.find((p) => p.id === params.id);

    if (pivo) {
      setFormData(pivo);
    }

    setLoading(false);
  }, [params.id]);

  const handleChange = (field: keyof PivoCentral, value: any) => {
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

    // Aqui seria a integração com o backend para atualizar o pivô central
    console.log('Dados atualizados do pivô central:', formData);

    // Redireciona para a lista de áreas
    router.push(`/areas/${params.propriedadeId}`);
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
              Carregando dados do pivô central...
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
            <h1 className='text-xl font-bold'>Pivô não encontrado</h1>
          </header>
          <div className='flex-1 flex items-center justify-center'>
            <div className='text-center'>
              <p>Sistema de pivô central não encontrado.</p>
              <Button
                onClick={() => router.push(`/areas/${params.propriedadeId}`)}
                className='mt-4'>
                Voltar para unidades
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
          <h1 className='text-xl font-bold'>Editar Sistema de Pivô Central</h1>
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
                  <Label htmlFor='identificacao'>Identificação do pivô *</Label>
                  <Input
                    id='identificacao'
                    value={formData.identificacao}
                    onChange={(e) =>
                      handleChange('identificacao', e.target.value)
                    }
                    required
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='area'>Área irrigada pelo pivô (ha) *</Label>
                  <Input
                    id='area'
                    type='number'
                    min='0'
                    step='0.01'
                    value={formData.area}
                    onChange={(e) =>
                      handleChange('area', Number.parseFloat(e.target.value))
                    }
                    required
                  />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='numeroTorres'>
                      Número de torres móveis *
                    </Label>
                    <Input
                      id='numeroTorres'
                      type='number'
                      min='0'
                      value={formData.numeroTorres}
                      onChange={(e) =>
                        handleChange(
                          'numeroTorres',
                          Number.parseInt(e.target.value)
                        )
                      }
                      required
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='comprimentoTotal'>
                      Comprimento total do pivô (m) *
                    </Label>
                    <Input
                      id='comprimentoTotal'
                      type='number'
                      min='0'
                      step='0.1'
                      value={formData.comprimentoTotal}
                      onChange={(e) =>
                        handleChange(
                          'comprimentoTotal',
                          Number.parseFloat(e.target.value)
                        )
                      }
                      required
                    />
                  </div>
                </div>
              </div>

              <div className='space-y-4'>
                <h2 className='text-lg font-medium'>
                  Informações do Fabricante
                </h2>

                <div className='space-y-2'>
                  <Label htmlFor='fabricante'>Marca/Fabricante do pivô *</Label>
                  <Input
                    id='fabricante'
                    value={formData.fabricante}
                    onChange={(e) => handleChange('fabricante', e.target.value)}
                    required
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='modelo'>Modelo do pivô</Label>
                  <Input
                    id='modelo'
                    value={formData.modelo}
                    onChange={(e) => handleChange('modelo', e.target.value)}
                  />
                </div>
              </div>

              <div className='space-y-4'>
                <h2 className='text-lg font-medium'>Informações Técnicas</h2>

                <div className='space-y-2'>
                  <Label htmlFor='tipoEmissao'>
                    Tipo de emissão (emissores) *
                  </Label>
                  <Select
                    value={formData.tipoEmissao}
                    onValueChange={(value) =>
                      handleChange('tipoEmissao', value)
                    }>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecione o tipo de emissão' />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposEmissao.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='tipoEnergia'>
                    Tipo de energia utilizada *
                  </Label>
                  <Select
                    value={formData.tipoEnergia}
                    onValueChange={(value) =>
                      handleChange('tipoEnergia', value)
                    }>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecione o tipo de energia' />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposEnergia.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='potenciaMotor'>
                      Potência do motor (cv) *
                    </Label>
                    <Input
                      id='potenciaMotor'
                      type='number'
                      min='0'
                      step='0.1'
                      value={formData.potenciaMotor}
                      onChange={(e) =>
                        handleChange(
                          'potenciaMotor',
                          Number.parseFloat(e.target.value)
                        )
                      }
                      required
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='vazaoOperacao'>
                      Vazão de operação (m³/h) *
                    </Label>
                    <Input
                      id='vazaoOperacao'
                      type='number'
                      min='0'
                      step='0.1'
                      value={formData.vazaoOperacao}
                      onChange={(e) =>
                        handleChange(
                          'vazaoOperacao',
                          Number.parseFloat(e.target.value)
                        )
                      }
                      required
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='pressaoOperacao'>
                      Pressão de operação na entrada (mca) *
                    </Label>
                    <Input
                      id='pressaoOperacao'
                      type='number'
                      min='0'
                      step='0.1'
                      value={formData.pressaoOperacao}
                      onChange={(e) =>
                        handleChange(
                          'pressaoOperacao',
                          Number.parseFloat(e.target.value)
                        )
                      }
                      required
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='tipoControle'>
                    Tipo de controle do pivô *
                  </Label>
                  <Select
                    value={formData.tipoControle}
                    onValueChange={(value) =>
                      handleChange('tipoControle', value)
                    }>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecione o tipo de controle' />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposControle.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='flex items-center space-x-2'>
                  <Switch
                    id='fertirrigacao'
                    checked={formData.possuiFertirrigacao}
                    onCheckedChange={(checked) =>
                      handleChange('possuiFertirrigacao', checked)
                    }
                  />
                  <Label htmlFor='fertirrigacao'>
                    Possui sistema de fertirrigação?
                  </Label>
                </div>
              </div>

              <div className='space-y-4'>
                <h2 className='text-lg font-medium'>
                  Informações Operacionais
                </h2>

                <div className='space-y-2'>
                  <Label htmlFor='tipoFonteHidrica'>
                    Tipo de fonte hídrica
                  </Label>
                  <Select
                    value={formData.tipoFonteHidrica}
                    onValueChange={(value) =>
                      handleChange('tipoFonteHidrica', value)
                    }>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecione o tipo de fonte hídrica' />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposFonteHidrica.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='tempoFuncionamento'>
                      Tempo médio de funcionamento (h/dia)
                    </Label>
                    <Input
                      id='tempoFuncionamento'
                      type='number'
                      min='0'
                      max='24'
                      step='0.1'
                      value={formData.tempoFuncionamento}
                      onChange={(e) =>
                        handleChange(
                          'tempoFuncionamento',
                          Number.parseFloat(e.target.value)
                        )
                      }
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='velocidadeDeslocamento'>
                      Velocidade média de deslocamento (%)
                    </Label>
                    <Input
                      id='velocidadeDeslocamento'
                      type='number'
                      min='0'
                      max='100'
                      step='0.1'
                      value={formData.velocidadeDeslocamento}
                      onChange={(e) =>
                        handleChange(
                          'velocidadeDeslocamento',
                          Number.parseFloat(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='tipoBocal'>Tipo de bocal utilizado</Label>
                    <Select
                      value={formData.tipoBocal}
                      onValueChange={(value) =>
                        handleChange('tipoBocal', value)
                      }>
                      <SelectTrigger>
                        <SelectValue placeholder='Selecione o tipo de bocal' />
                      </SelectTrigger>
                      <SelectContent>
                        {tiposBocal.map((tipo) => (
                          <SelectItem key={tipo} value={tipo}>
                            {tipo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='pressaoBocais'>
                      Pressão de operação dos bocais (mca)
                    </Label>
                    <Input
                      id='pressaoBocais'
                      type='number'
                      min='0'
                      step='0.1'
                      value={formData.pressaoBocais}
                      onChange={(e) =>
                        handleChange(
                          'pressaoBocais',
                          Number.parseFloat(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              <div className='space-y-4'>
                <h2 className='text-lg font-medium'>Manutenção e Avaliação</h2>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='dataUltimaManutencao'>
                      Data da última manutenção preventiva
                    </Label>
                    <Input
                      id='dataUltimaManutencao'
                      type='date'
                      value={formData.dataUltimaManutencao}
                      onChange={(e) =>
                        handleChange('dataUltimaManutencao', e.target.value)
                      }
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='frequenciaManutencao'>
                      Frequência de manutenção
                    </Label>
                    <Select
                      value={formData.frequenciaManutencao}
                      onValueChange={(value) =>
                        handleChange('frequenciaManutencao', value)
                      }>
                      <SelectTrigger>
                        <SelectValue placeholder='Selecione a frequência' />
                      </SelectTrigger>
                      <SelectContent>
                        {frequenciasManutenção.map((freq) => (
                          <SelectItem key={freq} value={freq}>
                            {freq}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='problemasObservados'>
                    Problemas observados
                  </Label>
                  <Textarea
                    id='problemasObservados'
                    value={formData.problemasObservados}
                    onChange={(e) =>
                      handleChange('problemasObservados', e.target.value)
                    }
                    rows={3}
                    placeholder='Descreva os problemas observados no sistema'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='dataUltimaAvaliacao'>
                    Data da última avaliação técnica
                  </Label>
                  <Input
                    id='dataUltimaAvaliacao'
                    type='date'
                    value={formData.dataUltimaAvaliacao}
                    onChange={(e) =>
                      handleChange('dataUltimaAvaliacao', e.target.value)
                    }
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
                        'Tem certeza que deseja excluir este pivô central? Esta ação não pode ser desfeita.'
                      )
                    ) {
                      // Aqui seria a integração com o backend para excluir o pivô
                      console.log('Excluindo pivô central:', formData.id);
                      router.push(`/areas/${params.propriedadeId}`);
                    }
                  }}>
                  Excluir Sistema de Pivô Central
                </Button>
              </div>
            </form>
          </Card>
        </main>

        <NavBar activeItem='areas' />
      </div>
    </AuthenticatedPage>
  );
}
