"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { X, Plus, Trash2 } from "lucide-react"

interface Repeticao {
  volume: number
  tempo: number
  vazao: number
}

interface DadosPonto {
  linha: number
  coluna: number
  repeticoes: Repeticao[]
  mediaVazao: number
}

interface PontoAvaliacaoModalProps {
  linha: number
  coluna: number
  labels: string[]
  dadosExistentes?: DadosPonto
  onSalvar: (dados: DadosPonto) => void
  onFechar: () => void
}

export function PontoAvaliacaoModal({
  linha,
  coluna,
  labels,
  dadosExistentes,
  onSalvar,
  onFechar,
}: PontoAvaliacaoModalProps) {
  const [repeticoes, setRepeticoes] = useState<Repeticao[]>(
    dadosExistentes?.repeticoes || [
      { volume: 0, tempo: 0, vazao: 0 },
      { volume: 0, tempo: 0, vazao: 0 },
      { volume: 0, tempo: 0, vazao: 0 },
    ],
  )

  const calcularVazao = (volume: number, tempo: number): number => {
    if (tempo === 0) return 0
    return Number(((volume / tempo) * 3.6).toFixed(2))
  }

  const calcularMediaVazao = (repeticoes: Repeticao[]): number => {
    const vazoesValidas = repeticoes.filter((r) => r.vazao > 0)
    if (vazoesValidas.length === 0) return 0
    const soma = vazoesValidas.reduce((acc, r) => acc + r.vazao, 0)
    return Number((soma / vazoesValidas.length).toFixed(2))
  }

  const handleVolumeChange = (index: number, volume: number) => {
    const novasRepeticoes = [...repeticoes]
    novasRepeticoes[index].volume = volume
    novasRepeticoes[index].vazao = calcularVazao(volume, novasRepeticoes[index].tempo)
    setRepeticoes(novasRepeticoes)
  }

  const handleTempoChange = (index: number, tempo: number) => {
    const novasRepeticoes = [...repeticoes]
    novasRepeticoes[index].tempo = tempo
    novasRepeticoes[index].vazao = calcularVazao(novasRepeticoes[index].volume, tempo)
    setRepeticoes(novasRepeticoes)
  }

  const adicionarRepeticao = () => {
    setRepeticoes([...repeticoes, { volume: 0, tempo: 0, vazao: 0 }])
  }

  const removerRepeticao = (index: number) => {
    if (repeticoes.length > 1) {
      const novasRepeticoes = repeticoes.filter((_, i) => i !== index)
      setRepeticoes(novasRepeticoes)
    }
  }

  const handleSalvar = () => {
    const mediaVazao = calcularMediaVazao(repeticoes)
    onSalvar({
      linha,
      coluna,
      repeticoes,
      mediaVazao,
    })
  }

  const mediaVazao = calcularMediaVazao(repeticoes)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white">
        <div className="p-4">
          <div className="flex justify-end mb-2">
            <Button variant="ghost" size="icon" onClick={onFechar} className="text-teal-600">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-white">
                  <th className="border border-gray-300 px-3 py-2 text-sm font-medium text-left">Rep.</th>
                  <th className="border border-gray-300 px-3 py-2 text-sm font-medium text-left">Volume</th>
                  <th className="border border-gray-300 px-3 py-2 text-sm font-medium text-left">tempo</th>
                  <th className="border border-gray-300 px-3 py-2 text-sm font-medium text-left">Vazão(l/h)</th>
                </tr>
              </thead>
              <tbody>
                {repeticoes.map((repeticao, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-3 py-2 text-sm">{index + 1}°</td>
                    <td className="border border-gray-300 px-2 py-1">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={repeticao.volume || ""}
                        onChange={(e) => handleVolumeChange(index, Number.parseFloat(e.target.value) || 0)}
                        className="h-8 text-sm border-0"
                        placeholder="0"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={repeticao.tempo || ""}
                        onChange={(e) => handleTempoChange(index, Number.parseFloat(e.target.value) || 0)}
                        className="h-8 text-sm border-0"
                        placeholder="0"
                      />
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-sm text-center">
                      {repeticao.vazao.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={adicionarRepeticao} className="text-teal-600 h-8 px-2">
                <Plus className="h-4 w-4 mr-1" />
                <span className="text-xs">Adicionar</span>
              </Button>
              {repeticoes.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removerRepeticao(repeticoes.length - 1)}
                  className="text-red-600 h-8 px-2"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  <span className="text-xs">Remover</span>
                </Button>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <p className="text-sm">média vazão: {mediaVazao.toFixed(2)}</p>
            <Button onClick={handleSalvar} className="bg-teal-600 hover:bg-teal-700 text-white">
              Salvar
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
