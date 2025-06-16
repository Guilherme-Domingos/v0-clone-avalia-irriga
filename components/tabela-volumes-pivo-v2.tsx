"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Calculator } from "lucide-react"

interface VolumeData {
  coletor: string
  distancia: number
  volume: number | null
  observacoes: string
}

interface RaioAvaliacao {
  id: string
  raio: number // raio em metros
  coletores: VolumeData[]
}

interface TabelaVolumesPivoV2Props {
  raiosAvaliacao: RaioAvaliacao[]
  onRaiosChange: (raios: RaioAvaliacao[]) => void
  diametroColetor: number
}

export function TabelaVolumesPivoV2({ raiosAvaliacao, onRaiosChange, diametroColetor }: TabelaVolumesPivoV2Props) {
  const [novoRaio, setNovoRaio] = useState(100)

  // Calcular número de coletores baseado no raio
  const calcularNumeroColetores = (raio: number): number => {
    // Fórmula: Circunferência / espaçamento entre coletores (assumindo 10m)
    const circunferencia = 2 * Math.PI * raio
    const espacamentoColetores = 10 // metros
    return Math.ceil(circunferencia / espacamentoColetores)
  }

  const adicionarRaio = () => {
    const numeroColetores = calcularNumeroColetores(novoRaio)
    const novosColetores: VolumeData[] = []

    for (let i = 1; i <= numeroColetores; i++) {
      novosColetores.push({
        coletor: `C${i}`,
        distancia: novoRaio,
        volume: null,
        observacoes: "",
      })
    }

    const novoRaioObj: RaioAvaliacao = {
      id: Date.now().toString(),
      raio: novoRaio,
      coletores: novosColetores,
    }

    onRaiosChange([...raiosAvaliacao, novoRaioObj])
    setNovoRaio(novoRaio + 50) // Incrementa para o próximo raio
  }

  const removerRaio = (raioId: string) => {
    onRaiosChange(raiosAvaliacao.filter((r) => r.id !== raioId))
  }

  const updateVolumeData = (
    raioId: string,
    coletorIndex: number,
    field: keyof VolumeData,
    value: string | number | null,
  ) => {
    const novosRaios = raiosAvaliacao.map((raio) => {
      if (raio.id === raioId) {
        const novosColetores = [...raio.coletores]
        novosColetores[coletorIndex] = {
          ...novosColetores[coletorIndex],
          [field]: value,
        }
        return { ...raio, coletores: novosColetores }
      }
      return raio
    })
    onRaiosChange(novosRaios)
  }

  return (
    <div className="space-y-6">
      {/* Controle para adicionar novo raio */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <Label htmlFor="novoRaio">Adicionar Raio de Avaliação (metros)</Label>
            <Input
              id="novoRaio"
              type="number"
              min="10"
              max="1000"
              step="10"
              value={novoRaio}
              onChange={(e) => setNovoRaio(Number.parseInt(e.target.value) || 100)}
              className="mt-1"
            />
          </div>
          <Button onClick={adicionarRaio} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Raio
          </Button>
        </div>
      </Card>

      {/* Tabelas para cada raio */}
      {raiosAvaliacao.map((raioData, raioIndex) => {
        const numeroColetores = raioData.coletores.length
        const volumesPreenchidos = raioData.coletores.filter((c) => c.volume !== null && c.volume > 0).length
        const percentualPreenchido = numeroColetores > 0 ? (volumesPreenchidos / numeroColetores) * 100 : 0

        return (
          <Card key={raioData.id} className="p-4 shadow-md">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-bold">Raio: {raioData.raio}m</h3>
                <div className="flex flex-col md:flex-row gap-4 text-sm text-gray-600 mt-1">
                  <span>Coletores calculados: {numeroColetores}</span>
                  <span>
                    Preenchidos: {volumesPreenchidos}/{numeroColetores} ({percentualPreenchido.toFixed(1)}%)
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removerRaio(raioData.id)}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="overflow-x-auto max-h-96 border border-gray-200 rounded-lg">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="border border-gray-300 px-3 py-2 text-sm font-bold text-left">Nº Coletor</th>
                    <th className="border border-gray-300 px-3 py-2 text-sm font-bold text-left">Distância (m)</th>
                    <th className="border border-gray-300 px-3 py-2 text-sm font-bold text-left">Volume (mL)</th>
                    <th className="border border-gray-300 px-3 py-2 text-sm font-bold text-left">Observações</th>
                  </tr>
                </thead>
                <tbody>
                  {raioData.coletores.map((coletor, coletorIndex) => {
                    const isEvenRow = coletorIndex % 2 === 0

                    return (
                      <tr key={`${raioData.id}-${coletorIndex}`} className={isEvenRow ? "bg-gray-50" : "bg-white"}>
                        <td className="border border-gray-300 px-3 py-2 text-sm font-medium">{coletor.coletor}</td>
                        <td className="border border-gray-300 px-3 py-2 text-sm">{coletor.distancia}</td>
                        <td className="border border-gray-300 px-2 py-1">
                          <Input
                            type="number"
                            min="0"
                            step="0.1"
                            value={coletor.volume !== null ? coletor.volume : ""}
                            onChange={(e) => {
                              const value = e.target.value === "" ? null : Number.parseFloat(e.target.value)
                              updateVolumeData(raioData.id, coletorIndex, "volume", value)
                            }}
                            className="h-8 text-sm border-0 focus:ring-1 focus:ring-blue-500"
                            placeholder="0"
                          />
                        </td>
                        <td className="border border-gray-300 px-2 py-1">
                          <Input
                            type="text"
                            value={coletor.observacoes}
                            onChange={(e) => updateVolumeData(raioData.id, coletorIndex, "observacoes", e.target.value)}
                            className="h-8 text-sm border-0 focus:ring-1 focus:ring-blue-500"
                            placeholder="Observações..."
                          />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {percentualPreenchido < 80 && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                ⚠️ Recomenda-se preencher pelo menos 80% dos coletores para uma avaliação confiável.
              </div>
            )}
          </Card>
        )
      })}

      {raiosAvaliacao.length === 0 && (
        <Card className="p-8 text-center bg-gray-50">
          <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum raio adicionado</h3>
          <p className="text-gray-600">Adicione pelo menos um raio de avaliação para começar a coleta de dados.</p>
        </Card>
      )}
    </div>
  )
}
