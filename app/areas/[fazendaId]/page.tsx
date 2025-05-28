"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { NavBar } from "@/components/nav-bar"
import { PlusIcon, SearchIcon, PencilIcon } from "lucide-react"
import type { Unidade } from "@/app/types"

export default function Areas({ params }: { params: { fazendaId: string } }) {
  // Dados simulados das propriedades (em um app real, viria do backend)
  const propriedadesSimuladas = [
    { id: "1", nome: "Tabuleiro de Russas" },
    { id: "2", nome: "Fazenda São José" },
  ]

  const propriedade = propriedadesSimuladas.find((p) => p.id === params.fazendaId)
  const nomePropriedade = propriedade?.nome || "Propriedade"
  const router = useRouter()

  // Dados simulados das unidades com tipo
  const [unidades, setUnidades] = useState<Unidade[]>([
    { id: "1", nome: "Setor Hidráulico 1 - Tomates", tipo: "setor-hidraulico", propriedadeId: params.fazendaId },
    { id: "2", nome: "Pivô Central 1 - Laranjas", tipo: "pivo-central", propriedadeId: params.fazendaId },
  ])

  const handleEditarUnidade = (unidade: Unidade) => {
    if (unidade.tipo === "setor-hidraulico") {
      router.push(`/unidades/${params.fazendaId}/setor-hidraulico/${unidade.id}/editar`)
    } else if (unidade.tipo === "pivo-central") {
      router.push(`/unidades/${params.fazendaId}/pivo-central/${unidade.id}/editar`)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-teal-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">{nomePropriedade}</h1>
        <Button variant="ghost" size="icon" className="text-white">
          <SearchIcon className="h-5 w-5" />
        </Button>
      </header>

      <main className="flex-1 p-4 space-y-4">
        <Button
          className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-md flex items-center justify-center gap-2 py-6"
          onClick={() => router.push(`/unidades/${params.fazendaId}/selecionar-tipo`)}
        >
          <PlusIcon className="h-5 w-5" />
          <span>Nova Unidade</span>
        </Button>

        <div className="space-y-3">
          {unidades.map((unidade) => (
            <Card
              key={unidade.id}
              className="p-4 bg-teal-50 hover:bg-teal-100 transition-colors cursor-pointer"
              onClick={() => router.push(`/avaliacoes/${unidade.id}`)}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-900">{unidade.nome}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-teal-600"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEditarUnidade(unidade)
                  }}
                >
                  <PencilIcon className="h-5 w-5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </main>

      <NavBar activeItem="areas" />
    </div>
  )
}
