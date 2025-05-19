"use client"

import { useState } from "react"
import { NavBar } from "@/components/nav-bar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CudChart } from "@/components/cud-chart"

export default function Relatorios() {
  const [selectedArea, setSelectedArea] = useState("1")

  // Dados simulados para o gráfico
  const chartData = {
    labels: ["Av. 01", "Av. 02", "Av. 03"],
    values: [90, 95, 92],
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-teal-600 text-white p-4">
        <h1 className="text-xl font-bold">Relatórios - Tabuleiro de Russas</h1>
      </header>

      <main className="flex-1 p-4 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Selecione a área</label>
          <Select value={selectedArea} onValueChange={setSelectedArea}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione uma área" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Talhão 1 - Tomates</SelectItem>
              <SelectItem value="2">Talhão 2 - Laranjas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-gray-200 p-4 rounded-lg">
          <h3 className="text-center font-medium mb-4">Gráfico avaliações CUD</h3>
          <CudChart data={chartData} />
        </div>
      </main>

      <NavBar activeItem="relatorios" />
    </div>
  )
}
