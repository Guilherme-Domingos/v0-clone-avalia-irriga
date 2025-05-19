"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { NavBar } from "@/components/nav-bar"
import { ChevronLeft, FileText } from "lucide-react"
import { Card } from "@/components/ui/card"
import { CoeficienteScale } from "@/components/coeficiente-scale"
import { Mapa3D } from "@/components/mapa-3d"

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
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-teal-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Talhão 1 - Tomates</h1>
        <Button
          variant="outline"
          className="bg-teal-500 hover:bg-teal-600 text-white border-teal-400 flex items-center gap-1"
        >
          <FileText className="h-4 w-4" />
          <span>Exportar</span>
        </Button>
      </header>

      <div className="p-4">
        <Button variant="ghost" className="flex items-center text-gray-700 mb-4" onClick={() => router.back()}>
          <ChevronLeft className="h-5 w-5 mr-1" />
          <span>voltar</span>
        </Button>
      </div>

      <main className="flex-1 px-4 space-y-4">
        <h2 className="text-xl font-semibold text-center">Avaliação 01 - 01/01/2020</h2>

        <Card className="p-4 bg-teal-50">
          <h3 className="text-center font-medium mb-3">Coeficiente de Uniformidade de Christiansen (CUC)</h3>
          <CoeficienteScale value={cucValue} />
        </Card>

        <Card className="p-4 bg-teal-50">
          <h3 className="text-center font-medium mb-3">Coeficiente de Uniformidade de Distribuição (CUD)</h3>
          <CoeficienteScale value={cudValue} />
        </Card>

        <div className="mt-6">
          <h3 className="text-center font-medium mb-3">Plano 3D do mapa (interativo)</h3>
          <Mapa3D />
        </div>
      </main>

      <NavBar activeItem="areas" />
    </div>
  )
}
