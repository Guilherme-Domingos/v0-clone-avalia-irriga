'use client';

import type React from 'react';

import { useState } from 'react';
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

export default function NovoPivoCentral({
  params,
}: {
  params: { propriedadeId: string };
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    identificacao: '',
    area: '',
    numeroTorres: '',
    comprimentoTotal: '',
    fabricante: '',
    modelo: '',
    tipoEmissao: '',
    tipoEnergia: '',
    potenciaMotor: '',
    vazaoOperacao: '',
    pressaoOperacao: '',
    tipoControle: '',
    possuiFertirrigacao: false,
    tipoFonteHidrica: '',
    tempoFuncionamento: '',
    velocidadeDeslocamento: '',
    tipoBocal: '',
    pressaoBocais: '',
    dataUltimaManutencao: '',
    frequenciaManutencao: '',
    problemasObservados: '',
    dataUltimaAvaliacao: '',
  });

  const handleChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Aqui seria a integração com o backend para salvar o pivô central
    console.log('Dados do pivô central:', formData);

    // Redireciona para a lista de áreas
    router.push(`/areas/${params.propriedadeId}`);
  };

  return (
    <AuthenticatedPage>
      <div className='flex flex-col min-h-screen bg-gray-50'>
        <header className='bg-teal-600 text-white p-4'>
          <h1 className='text-xl font-bold'>Novo Sistema de Pivô Central</h1>
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
                    onChange={(e) => handleChange('area', e.target.value)}
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
                        handleChange('numeroTorres', e.target.value)
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
                        handleChange('comprimentoTotal', e.target.value)
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
                        handleChange('potenciaMotor', e.target.value)
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
                        handleChange('vazaoOperacao', e.target.value)
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
                        handleChange('pressaoOperacao', e.target.value)
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
                        handleChange('tempoFuncionamento', e.target.value)
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
                        handleChange('velocidadeDeslocamento', e.target.value)
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
                        handleChange('pressaoBocais', e.target.value)
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

              <div className='pt-4'>
                <Button
                  type='submit'
                  className='w-full bg-teal-600 hover:bg-teal-700 text-white'>
                  Cadastrar Sistema de Pivô Central
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
