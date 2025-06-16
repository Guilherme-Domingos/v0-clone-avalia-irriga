"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { ChevronLeft, FileText } from "lucide-react"
import { CoeficienteScale } from "@/components/coeficiente-scale"
import { Mapa3DInterativo } from "@/components/mapa-3d-interativo"

export default function DetalheAvaliacao({
  params,
}: {
  params: { areaId: string; avaliacaoId: string }
}) {
  const router = useRouter()

  // Dados simulados para os coeficientes
  const cucValue = 85 // valor entre 0-100
  const cudValue = 90 // valor entre 0-100

  return (
    <LayoutWrapper activeItem="areas" showNavBar={false}>
      <div className="flex flex-col h-full">
        <header className="bg-teal-600 text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-white p-0 h-9 w-9 md:hidden" onClick={() => router.back()}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg md:text-xl font-bold">Talhão 1 - Tomates</h1>
          </div>
          <Button
            variant="outline"
            className="bg-teal-500 hover:bg-teal-600 text-white border-teal-400 flex items-center gap-1"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden md:inline">Exportar</span>
          </Button>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 space-y-6 max-w-6xl mx-auto w-full">
          <h2 className="text-xl md:text-2xl font-semibold text-center">Avaliação 01 - 01/01/2020</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Coeficientes na esquerda */}
            <div className="space-y-6">
              <Card className="p-4 md:p-6 bg-teal-50">
                <h3 className="text-center font-medium mb-4">Coeficiente de Uniformidade de Christiansen (CUC)</h3>
                <CoeficienteScale value={cucValue} />
                <div className="text-center mt-2">
                  <span className="text-2xl font-bold text-teal-600">{cucValue}%</span>
                </div>
              </Card>

              <Card className="p-4 md:p-6 bg-teal-50">
                <h3 className="text-center font-medium mb-4">Coeficiente de Uniformidade de Distribuição (CUD)</h3>
                <CoeficienteScale value={cudValue} />
                <div className="text-center mt-2">
                  <span className="text-2xl font-bold text-teal-600">{cudValue}%</span>
                </div>
              </Card>
            </div>

            {/* Gráfico 3D na direita */}
            <div className="space-y-4">
              <h3 className="text-center font-medium">Plano 3D do mapa (interativo)</h3>
              <Card className="p-4">
                <Mapa3DInterativo titulo="Distribuição de Vazão" />
              </Card>
            </div>
          </div>

          {/* Informações adicionais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="p-4 text-center">
              <h4 className="font-medium text-gray-600 mb-2">Pontos Avaliados</h4>
              <p className="text-2xl font-bold text-blue-600">16</p>
            </Card>

            <Card className="p-4 text-center">
              <h4 className="font-medium text-gray-600 mb-2">Vazão Média</h4>
              <p className="text-2xl font-bold text-green-600">2.3 L/h</p>
            </Card>

            <Card className="p-4 text-center">
              <h4 className="font-medium text-gray-600 mb-2">Classificação</h4>
              <p className="text-2xl font-bold text-yellow-600">BOM</p>
            </Card>
          </div>

          {/* Botões de ação */}
          <div className="flex flex-col md:flex-row gap-4 justify-center pt-6">
            <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
              Comparar com Avaliação Anterior
            </Button>

            <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
              Gerar Relatório Detalhado
            </Button>

            <Button variant="ghost" onClick={() => router.back()} className="text-red-600 hover:bg-red-50">
              Voltar
            </Button>
          </div>
        </main>
      </div>
    </LayoutWrapper>
  )
}
