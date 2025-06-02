"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronDown, ChevronUp, Download } from "lucide-react"

interface DadoDetalhado {
  raio: string
  distancia: number
  volume: number
  lamina: number
  diferencaMedia: number
}

interface TabelaDadosDetalhadaProps {
  dadosDetalhados: DadoDetalhado[]
}

export function TabelaDadosDetalhada({ dadosDetalhados }: TabelaDadosDetalhadaProps) {
  const [expandida, setExpandida] = useState(true)
  const [paginaAtual, setPaginaAtual] = useState(1)
  const itensPorPagina = 10

  const totalPaginas = Math.ceil(dadosDetalhados.length / itensPorPagina)
  const dadosPaginados = dadosDetalhados.slice((paginaAtual - 1) * itensPorPagina, paginaAtual * itensPorPagina)

  const handleExportarCSV = () => {
    // Implementar exportação CSV
    console.log("Exportando dados para CSV...")

    // Criar conteúdo CSV
    const cabecalho = "Raio,Distância (m),Volume (mL),Lâmina (mm),Diferença p/ Média (%)\n"
    const linhas = dadosDetalhados
      .map(
        (d) =>
          `${d.raio},${d.distancia},${d.volume},${d.lamina.toFixed(2)},${d.diferencaMedia >= 0 ? "+" : ""}${d.diferencaMedia.toFixed(2)}`,
      )
      .join("\n")

    const conteudoCSV = cabecalho + linhas

    // Criar blob e link para download
    const blob = new Blob([conteudoCSV], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "dados_avaliacao_pivo.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Card className="p-4 shadow-md">
      <div className="flex justify-between items-center cursor-pointer mb-4" onClick={() => setExpandida(!expandida)}>
        <h2 className="text-xl font-bold">Dados Detalhados</h2>
        {expandida ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>

      {expandida && (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-3 py-2 text-sm font-bold text-left">Raio</th>
                  <th className="border border-gray-300 px-3 py-2 text-sm font-bold text-left">Distância (m)</th>
                  <th className="border border-gray-300 px-3 py-2 text-sm font-bold text-left">Volume (mL)</th>
                  <th className="border border-gray-300 px-3 py-2 text-sm font-bold text-left">Lâmina (mm)</th>
                  <th className="border border-gray-300 px-3 py-2 text-sm font-bold text-left">
                    Diferença p/ Média (%)
                  </th>
                </tr>
              </thead>
              <tbody>
                {dadosPaginados.map((dado, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="border border-gray-300 px-3 py-2 text-sm">{dado.raio}</td>
                    <td className="border border-gray-300 px-3 py-2 text-sm">{dado.distancia}</td>
                    <td className="border border-gray-300 px-3 py-2 text-sm">{dado.volume}</td>
                    <td className="border border-gray-300 px-3 py-2 text-sm">{dado.lamina.toFixed(2)}</td>
                    <td className="border border-gray-300 px-3 py-2 text-sm">
                      <span className={dado.diferencaMedia >= 0 ? "text-green-600" : "text-red-600"}>
                        {dado.diferencaMedia >= 0 ? "+" : ""}
                        {dado.diferencaMedia.toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPaginaAtual(Math.max(1, paginaAtual - 1))}
                disabled={paginaAtual === 1}
              >
                Anterior
              </Button>
              <span className="flex items-center px-3 text-sm">
                Página {paginaAtual} de {totalPaginas}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPaginaAtual(Math.min(totalPaginas, paginaAtual + 1))}
                disabled={paginaAtual === totalPaginas}
              >
                Próxima
              </Button>
            </div>

            <Button variant="outline" size="sm" onClick={handleExportarCSV} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exportar CSV
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
