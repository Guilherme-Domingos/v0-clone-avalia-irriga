"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { PlusIcon, SearchIcon, PencilIcon } from "lucide-react"
import type { Unidade } from "@/app/types"

export default function Areas({ params }: { params: { fazendaId: string } }) {
  const propriedadesSimuladas = [
    { id: "1", nome: "Tabuleiro de Russas" },
    { id: "2", nome: "Fazenda São José" },
  ]

  const propriedade = propriedadesSimuladas.find((p) => p.id === params.fazendaId)
  const nomePropriedade = propriedade?.nome || "Propriedade"
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  const [unidades, setUnidades] = useState<Unidade[]>([
    { id: "1", nome: "Setor Hidráulico 1 - Tomates", tipo: "setor-hidraulico", propriedadeId: params.fazendaId },
    { id: "2", nome: "Pivô Central 1 - Laranjas", tipo: "pivo-central", propriedadeId: params.fazendaId },
    { id: "3", nome: "Setor Hidráulico 2 - Melões", tipo: "setor-hidraulico", propriedadeId: params.fazendaId },
  ])

  const filteredUnidades = unidades.filter((unidade) => unidade.nome.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleEditarUnidade = (unidade: Unidade) => {
    if (unidade.tipo === "setor-hidraulico") {
      router.push(`/unidades/${params.fazendaId}/setor-hidraulico/${unidade.id}/editar`)
    } else if (unidade.tipo === "pivo-central") {
      router.push(`/unidades/${params.fazendaId}/pivo-central/${unidade.id}/editar`)
    }
  }

  return (
    <LayoutWrapper activeItem="areas">
      <div className="flex flex-col h-full">
        <header className="bg-teal-600 text-white p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h1 className="text-xl md:text-2xl font-bold ml-12 md:ml-0">{nomePropriedade}</h1>
            <div className="relative flex-1 md:w-64">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar unidades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white h-12"
              />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 space-y-4 md:space-y-6">
          <Button
            className="w-full md:w-auto bg-teal-600 hover:bg-teal-700 text-white rounded-md flex items-center justify-center gap-2 py-6 md:py-3 md:px-6"
            onClick={() => router.push(`/unidades/${params.fazendaId}/selecionar-tipo`)}
          >
            <PlusIcon className="h-5 w-5" />
            <span>Nova Unidade</span>
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUnidades.map((unidade) => (
              <Card
                key={unidade.id}
                className="p-4 md:p-6 bg-teal-50 hover:bg-teal-100 transition-colors cursor-pointer"
                onClick={() => router.push(`/avaliacoes/${unidade.id}`)}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <h3 className="font-medium text-gray-900 text-lg">{unidade.nome}</h3>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Tipo:</span>{" "}
                      {unidade.tipo === "setor-hidraulico" ? "Setor Hidráulico" : "Pivô Central"}
                    </p>
                    <div className="flex gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          unidade.tipo === "setor-hidraulico"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {unidade.tipo === "setor-hidraulico" ? "Gotejamento" : "Aspersão"}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-teal-600 hover:bg-teal-200"
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

          {filteredUnidades.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhuma unidade encontrada.</p>
            </div>
          )}
        </main>
      </div>
    </LayoutWrapper>
  )
}
