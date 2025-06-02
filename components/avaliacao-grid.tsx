"use client"

import React, { useState } from "react"
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
        {labels.map((label, index) => (
          <div key={`col-${index}`} className="text-center text-sm font-medium">
            {label}
          </div>
        ))}

        {/* Linhas da grade */}
        {labels.map((labelLinha, linha) => (
          <React.Fragment key={`row-${linha}`}>
            {/* Label da linha */}
            <div className="text-center text-sm font-medium flex items-center justify-center">{labelLinha}</div>

            {/* Pontos da linha */}
            {labels.map((_, coluna) => {
              const avaliado = isPontoAvaliado(linha, coluna)
              return (
                <div key={`ponto-${linha}-${coluna}`} className="flex justify-center items-center">
                  <button
                    className={`w-12 h-12 rounded-full ${
                      avaliado ? "bg-teal-500" : "bg-black"
                    } hover:opacity-80 transition-colors`}
                    onClick={() => handleClickPonto(linha, coluna)}
                    aria-label={`Ponto ${labelLinha} x ${labels[coluna]}`}
                  />
                </div>
              )
            })}
          </React.Fragment>
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
