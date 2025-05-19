import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Funções para cálculo dos coeficientes de uniformidade

/**
 * Calcula o Coeficiente de Uniformidade de Christiansen (CUC)
 * @param vazoes Array com as vazões medidas
 * @returns Valor do CUC em percentual
 */
export function calcularCUC(vazoes: number[]): number {
  if (vazoes.length === 0) return 0

  const mediaVazao = vazoes.reduce((sum, vazao) => sum + vazao, 0) / vazoes.length
  const somatorioDesvios = vazoes.reduce((sum, vazao) => sum + Math.abs(vazao - mediaVazao), 0)

  const cuc = 100 * (1 - somatorioDesvios / (vazoes.length * mediaVazao))
  return Math.round(cuc * 100) / 100 // Arredonda para 2 casas decimais
}

/**
 * Calcula o Coeficiente de Uniformidade de Distribuição (CUD)
 * @param vazoes Array com as vazões medidas
 * @returns Valor do CUD em percentual
 */
export function calcularCUD(vazoes: number[]): number {
  if (vazoes.length === 0) return 0

  const mediaVazao = vazoes.reduce((sum, vazao) => sum + vazao, 0) / vazoes.length

  // Ordena as vazões em ordem crescente
  const vazoesOrdenadas = [...vazoes].sort((a, b) => a - b)

  // Calcula a média do quartil inferior (25% menores valores)
  const quartilInferior = Math.ceil(vazoes.length * 0.25)
  const mediaQuartilInferior =
    vazoesOrdenadas.slice(0, quartilInferior).reduce((sum, vazao) => sum + vazao, 0) / quartilInferior

  const cud = 100 * (mediaQuartilInferior / mediaVazao)
  return Math.round(cud * 100) / 100 // Arredonda para 2 casas decimais
}
