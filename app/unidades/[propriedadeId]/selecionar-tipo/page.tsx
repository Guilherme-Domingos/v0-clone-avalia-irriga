"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { NavBar } from "@/components/nav-bar"
import { ChevronLeft } from "lucide-react"

export default function SelecionarTipoUnidade({ params }: { params: { propriedadeId: string } }) {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-teal-600 text-white p-4">
        <h1 className="text-xl font-bold">Selecionar Tipo de Unidade</h1>
      </header>

      <div className="p-4">
        <Button variant="ghost" className="flex items-center text-gray-700 mb-4" onClick={() => router.back()}>
          <ChevronLeft className="h-5 w-5 mr-1" />
          <span>voltar</span>
        </Button>
      </div>

      <main className="flex-1 p-4 space-y-6">
        <h2 className="text-lg font-medium text-center mb-4">Selecione o tipo de unidade que deseja cadastrar:</h2>

        <div className="space-y-4">
          <Card
            className="p-6 bg-teal-50 hover:bg-teal-100 transition-colors cursor-pointer"
            onClick={() => router.push(`/unidades/${params.propriedadeId}/setor-hidraulico/nova`)}
          >
            <div className="text-center">
              <h3 className="text-xl font-medium text-teal-800 mb-2">Setor Hidráulico</h3>
              <p className="text-gray-600">
                Cadastre um setor hidráulico com informações sobre emissores, filtros e válvulas.
              </p>
            </div>
          </Card>

          <Card
            className="p-6 bg-teal-50 hover:bg-teal-100 transition-colors cursor-pointer"
            onClick={() => router.push(`/unidades/${params.propriedadeId}/pivo-central/nova`)}
          >
            <div className="text-center">
              <h3 className="text-xl font-medium text-teal-800 mb-2">Sistema de Pivô Central</h3>
              <p className="text-gray-600">
                Cadastre um sistema de pivô central com informações sobre torres, emissores e controle.
              </p>
            </div>
          </Card>
        </div>
      </main>

      <NavBar activeItem="areas" />
    </div>
  )
}
