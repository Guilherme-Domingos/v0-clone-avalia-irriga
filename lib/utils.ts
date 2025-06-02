import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calcula o Coeficiente de Uniformidade de Christiansen (CUC)
 * @param valores Array com os valores (lâminas ou vazões)
 * @returns Valor do CUC em percentual
 */
export function calcularCUC(valores: number[]): number {
  if (valores.length === 0) return 0

  const media = valores.reduce((sum, valor) => sum + valor, 0) / valores.length
  const somatorioDesvios = valores.reduce((sum, valor) => sum + Math.abs(valor - media), 0)

  const cuc = 100 * (1 - somatorioDesvios / (valores.length * media))
  return Math.round(cuc * 100) / 100 // Arredonda para 2 casas decimais
}

/**
 * Calcula o Coeficiente de Uniformidade de Distribuição (CUD)
 * @param valores Array com os valores (lâminas ou vazões)
 * @returns Valor do CUD em percentual
 */
export function calcularCUD(valores: number[]): number {
  if (valores.length === 0) return 0

  const media = valores.reduce((sum, valor) => sum + valor, 0) / valores.length

  // Ordena os valores em ordem crescente
  const valoresOrdenados = [...valores].sort((a, b) => a - b)

  // Calcula a média do quartil inferior (25% menores valores)
  const quartilInferior = Math.ceil(valores.length * 0.25)
  const mediaQuartilInferior =
    valoresOrdenados.slice(0, quartilInferior).reduce((sum, valor) => sum + valor, 0) / quartilInferior

  const cud = 100 * (mediaQuartilInferior / media)
  return Math.round(cud * 100) / 100 // Arredonda para 2 casas decimais
}
