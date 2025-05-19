// Tipos para as entidades principais do sistema

export interface Usuario {
  id: string
  nome: string
  email: string
  organizacao: string
}

export interface Fazenda {
  id: string
  nome: string
  localizacao: string
  areasCadastradas: number
}

export interface Area {
  id: string
  nome: string
  fazendaId: string
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
