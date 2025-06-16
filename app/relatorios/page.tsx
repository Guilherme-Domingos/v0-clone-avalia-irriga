"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { CudChart } from "@/components/cud-chart"
import { Download, BarChart3, TrendingUp } from "lucide-react"

export default function Relatorios() {
  const [selectedArea, setSelectedArea] = useState("1")
  const [selectedPeriodo, setSelectedPeriodo] = useState("6meses")

  // Dados simulados para o gráfico
  const chartData = {
    labels: ["Av. 01", "Av. 02", "Av. 03", "Av. 04", "Av. 05"],
    values: [90, 95, 92, 88, 94],
  }

  const estatisticas = {
    totalAvaliacoes: 12,
    mediaGeral: 91.2,
    melhorCUD: 95,
    piorCUD: 85,
  }

  return (
    <LayoutWrapper activeItem="relatorios">
      <div className="flex flex-col h-full">
        <header className="bg-teal-600 text-white p-4 md:p-6">
          <h1 className="text-xl md:text-2xl font-bold ml-12 md:ml-0">Relatórios - Tabuleiro de Russas</h1>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 space-y-6 max-w-6xl mx-auto w-full">
          {/* Filtros */}
          <Card className="p-4 md:p-6">
            <h2 className="text-lg font-semibold mb-4">Filtros</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Selecione a área</label>
                <Select value={selectedArea} onValueChange={setSelectedArea}>
                  <SelectTrigger className="w-full h-12">
                    <SelectValue placeholder="Selecione uma área" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Talhão 1 - Tomates</SelectItem>
                    <SelectItem value="2">Talhão 2 - Laranjas</SelectItem>
                    <SelectItem value="3">Setor 3 - Melões</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Período</label>
                <Select value={selectedPeriodo} onValueChange={setSelectedPeriodo}>
                  <SelectTrigger className="w-full h-12">
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1mes">Último mês</SelectItem>
                    <SelectItem value="3meses">Últimos 3 meses</SelectItem>
                    <SelectItem value="6meses">Últimos 6 meses</SelectItem>
                    <SelectItem value="1ano">Último ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Atualizar Relatório
                </Button>
              </div>
            </div>
          </Card>

          {/* Estatísticas Resumidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{estatisticas.totalAvaliacoes}</div>
              <div className="text-sm text-gray-600">Total de Avaliações</div>
            </Card>

            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{estatisticas.mediaGeral}%</div>
              <div className="text-sm text-gray-600">CUD Médio</div>
            </Card>

            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-emerald-600">{estatisticas.melhorCUD}%</div>
              <div className="text-sm text-gray-600">Melhor CUD</div>
            </Card>

            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{estatisticas.piorCUD}%</div>
              <div className="text-sm text-gray-600">Pior CUD</div>
            </Card>
          </div>

          {/* Gráfico Principal */}
          <Card className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
              <h3 className="text-lg font-semibold">Evolução do CUD - Últimos 6 Meses</h3>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exportar Dados
              </Button>
            </div>
            <div className="h-64 md:h-80">
              <CudChart data={chartData} />
            </div>
          </Card>

          {/* Análise e Tendências */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-4 md:p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold">Análise de Tendência</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium">Tendência Geral</span>
                  <span className="text-green-600 font-bold">↗ Melhorando</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium">Variação Mensal</span>
                  <span className="text-blue-600 font-bold">+2.3%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <span className="text-sm font-medium">Estabilidade</span>
                  <span className="text-yellow-600 font-bold">Moderada</span>
                </div>
              </div>
            </Card>

            <Card className="p-4 md:p-6">
              <h3 className="text-lg font-semibold mb-4">Recomendações</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                  <p className="text-sm font-medium text-blue-800">Manutenção Preventiva</p>
                  <p className="text-xs text-blue-600 mt-1">Realizar limpeza dos filtros mensalmente</p>
                </div>
                <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded">
                  <p className="text-sm font-medium text-green-800">Calibração</p>
                  <p className="text-xs text-green-600 mt-1">Verificar pressão dos emissores</p>
                </div>
                <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                  <p className="text-sm font-medium text-yellow-800">Monitoramento</p>
                  <p className="text-xs text-yellow-600 mt-1">Aumentar frequência de avaliações</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Ações */}
          <div className="flex flex-col md:flex-row gap-4 justify-center pt-6">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white h-12 px-6">
              <Download className="h-4 w-4 mr-2" />
              Exportar Relatório Completo
            </Button>

            <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50 h-12 px-6">
              <BarChart3 className="h-4 w-4 mr-2" />
              Comparar Propriedades
            </Button>

            <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50 h-12 px-6">
              Agendar Nova Avaliação
            </Button>
          </div>
        </main>
      </div>
    </LayoutWrapper>
  )
}
