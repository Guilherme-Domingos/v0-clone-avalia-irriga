"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PontoAvaliacaoModal } from "@/components/ponto-avaliacao-modal"

interface AvaliacaoGridProps {
  onPontoAvaliado: (linha: number, coluna: number, avaliado: boolean) => void
  pontosAvaliados: { [key: string]: boolean }
}

interface DadosPonto {
  linha: number
  coluna: number
  repeticoes: Array<{
    volume: number
    tempo: number
    vazao: number
  }>
  mediaVazao: number
}

export function AvaliacaoGrid({ onPontoAvaliado, pontosAvaliados }: AvaliacaoGridProps) {
  const [pontoSelecionado, setPontoSelecionado] = useState<{ linha: number; coluna: number } | null>(null)
  const [dadosPontos, setDadosPontos] = useState<{ [key: string]: DadosPonto }>({})

  const labels = ["1°", "1/3", "2/3", "Últ."]

  const handleClickPonto = (linha: number, coluna: number) => {
    setPontoSelecionado({ linha, coluna })
  }

  const handleSalvarPonto = (dados: DadosPonto) => {
    const key = `${dados.linha}-${dados.coluna}`
    setDadosPontos((prev) => ({
      ...prev,
      [key]: dados,
    }))
    onPontoAvaliado(dados.linha, dados.coluna, true)
    setPontoSelecionado(null)
  }

  const isPontoAvaliado = (linha: number, coluna: number) => {
    const key = `${linha}-${coluna}`
    return pontosAvaliados[key] || false
  }

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-5 gap-2 mb-4">
        {/* Cabeçalho das colunas */}
        <div></div>
        {labels.map((label) => (
          <div key={label} className="text-center text-sm font-medium">
            {label}
          </div>
        ))}

        {/* Linhas da grade */}
        {labels.map((labelLinha, linha) => (
          <>
            {/* Label da linha */}
            <div key={`label-${linha}`} className="text-center text-sm font-medium flex items-center">
              {labelLinha}
            </div>

            {/* Pontos da linha */}
            {labels.map((_, coluna) => {
              const avaliado = isPontoAvaliado(linha, coluna)
              return (
                <Button
                  key={`${linha}-${coluna}`}
                  variant="outline"
                  className={`w-12 h-12 p-0 rounded-full border-2 ${
                    avaliado
                      ? "bg-teal-500 border-teal-600 hover:bg-teal-600"
                      : "bg-gray-800 border-gray-900 hover:bg-gray-700"
                  }`}
                  onClick={() => handleClickPonto(linha, coluna)}
                />
              )
            })}
          </>
        ))}
      </div>

      {pontoSelecionado && (
        <PontoAvaliacaoModal
          linha={pontoSelecionado.linha}
          coluna={pontoSelecionado.coluna}
          labels={labels}
          dadosExistentes={dadosPontos[`${pontoSelecionado.linha}-${pontoSelecionado.coluna}`]}
          onSalvar={handleSalvarPonto}
          onFechar={() => setPontoSelecionado(null)}
        />
      )}
    </div>
  )
}
