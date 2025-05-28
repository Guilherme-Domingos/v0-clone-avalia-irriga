// Tipos para as entidades principais do sistema

export interface Usuario {
  id: string
  nome: string
  email: string
  organizacao: string
}

export interface PropriedadeAgricola {
  id: string
  nome: string
  proprietario: string
  tecnicoResponsavel: string
  telefoneContato: string
  emailResponsavel: string
  municipio: string
  estado: string
  latitude: string
  longitude: string
  areaTotal: number
  areaIrrigada: number
  culturasExploradas: string[]
  tipoIrrigacao: string
  observacoes: string
  areasCadastradas: number
}

export interface Unidade {
  id: string
  nome: string
  tipo: "setor-hidraulico" | "pivo-central"
  propriedadeId: string
}

export interface SetorHidraulico {
  id: string
  identificacao: string
  area: number
  tipoEmissor: string
  fabricanteEmissor: string
  modeloEmissor: string
  vazaoNominal: number
  pressaoTrabalho: number
  distanciaEmissores: number
  distanciaLinhas: number
  tipoFiltro: string
  malhaFiltro: string
  pressaoEntrada: number
  tipoValvula: string
  tipoEnergia: string
  condicoesGerais: string
  numeroEmissores: number
  frequenciaManutenção: string
  dataUltimaAvaliacao: string
  propriedadeId: string
}

export interface PivoCentral {
  id: string
  identificacao: string
  area: number
  numeroTorres: number
  comprimentoTotal: number
  fabricante: string
  modelo: string
  tipoEmissao: string
  tipoEnergia: string
  potenciaMotor: number
  vazaoOperacao: number
  pressaoOperacao: number
  tipoControle: string
  possuiFertirrigacao: boolean
  tipoFonteHidrica: string
  tempoFuncionamento: number
  velocidadeDeslocamento: number
  tipoBocal: string
  pressaoBocais: number
  dataUltimaManutencao: string
  frequenciaManutencao: string
  problemasObservados: string
  dataUltimaAvaliacao: string
  propriedadeId: string
}

export interface Area {
  id: string
  nome: string
  propriedadeId: string
  cultura: string
}

export interface Avaliacao {
  id: string
  areaId: string
  data: string
  nome: string
  cuc: number // Coeficiente de Uniformidade de Christiansen
  cud: number // Coeficiente de Uniformidade de Distribuição
  pontos: PontoAvaliacao[]
  comentarios: Comentario[]
}

export interface PontoAvaliacao {
  posicao: string // Ex: "1°", "1/3", etc.
  linha: number
  coluna: number
  volume: number
  tempo: number
  vazao: number
}

export interface Comentario {
  id: string
  texto: string
  imagem?: string
  avaliacaoId: string
}
