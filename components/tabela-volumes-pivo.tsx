"use client"

import { Input } from "@/components/ui/input"

interface VolumeData {
  raio: string
  distancia: number
  volume: number | null
  observacoes: string
}

interface TabelaVolumesPivoProps {
  numeroRaios: number
  volumes: VolumeData[]
  onVolumesChange: (volumes: VolumeData[]) => void
}

export function TabelaVolumesPivo({ numeroRaios, volumes, onVolumesChange }: TabelaVolumesPivoProps) {
  // Gerar distâncias de 10m até 560m
  const distancias = Array.from({ length: 56 }, (_, i) => (i + 1) * 10)
  const raios = Array.from({ length: numeroRaios }, (_, i) => `R${i + 1}`)

  const getVolumeData = (raio: string, distancia: number): VolumeData => {
    return (
      volumes.find((v) => v.raio === raio && v.distancia === distancia) || {
        raio,
        distancia,
        volume: null,
        observacoes: "",
      }
    )
  }

  const updateVolumeData = (
    raio: string,
    distancia: number,
    field: keyof VolumeData,
    value: string | number | null,
  ) => {
    const newVolumes = [...volumes]
    const existingIndex = newVolumes.findIndex((v) => v.raio === raio && v.distancia === distancia)

    if (existingIndex >= 0) {
      newVolumes[existingIndex] = {
        ...newVolumes[existingIndex],
        [field]: value,
      }
    } else {
      newVolumes.push({
        raio,
        distancia,
        volume: field === "volume" ? Number(value) : null,
        observacoes: field === "observacoes" ? String(value) : "",
      })
    }

    onVolumesChange(newVolumes)
  }

  return (
    <div className="overflow-x-auto max-h-96 border border-gray-200 rounded-lg">
      <table className="w-full border-collapse">
        <thead className="bg-gray-100 sticky top-0">
          <tr>
            <th className="border border-gray-300 px-3 py-2 text-sm font-bold text-left">Raio</th>
            <th className="border border-gray-300 px-3 py-2 text-sm font-bold text-left">Distância ao Centro (m)</th>
            <th className="border border-gray-300 px-3 py-2 text-sm font-bold text-left">Volume Coletado (mL)</th>
            <th className="border border-gray-300 px-3 py-2 text-sm font-bold text-left">Observações</th>
          </tr>
        </thead>
        <tbody>
          {raios.map((raio) =>
            distancias.map((distancia, index) => {
              const volumeData = getVolumeData(raio, distancia)
              const isEvenRow = index % 2 === 0

              return (
                <tr key={`${raio}-${distancia}`} className={isEvenRow ? "bg-gray-50" : "bg-white"}>
                  <td className="border border-gray-300 px-3 py-2 text-sm">{raio}</td>
                  <td className="border border-gray-300 px-3 py-2 text-sm">{distancia}</td>
                  <td className="border border-gray-300 px-2 py-1">
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      value={volumeData.volume !== null ? volumeData.volume : ""}
                      onChange={(e) => {
                        const value = e.target.value === "" ? null : Number.parseFloat(e.target.value)
                        updateVolumeData(raio, distancia, "volume", value)
                      }}
                      className="h-8 text-sm border-0 focus:ring-1 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    <Input
                      type="text"
                      value={volumeData.observacoes}
                      onChange={(e) => updateVolumeData(raio, distancia, "observacoes", e.target.value)}
                      className="h-8 text-sm border-0 focus:ring-1 focus:ring-blue-500"
                      placeholder="Observações..."
                    />
                  </td>
                </tr>
              )
            }),
          )}
        </tbody>
      </table>
    </div>
  )
}
