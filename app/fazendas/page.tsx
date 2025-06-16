"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { PlusIcon, SearchIcon, PencilIcon } from "lucide-react"
import type { PropriedadeAgricola } from "@/app/types"

export default function PropriedadesAgricolas() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [propriedades, setPropriedades] = useState<PropriedadeAgricola[]>([
    {
      id: "1",
      nome: "Tabuleiro de Russas",
      proprietario: "João Silva",
      tecnicoResponsavel: "Carlos Oliveira",
      telefoneContato: "(88) 99999-9999",
      emailResponsavel: "joao.silva@email.com",
      municipio: "Russas",
      estado: "CE",
      latitude: "-5.1234",
      longitude: "-38.5678",
      areaTotal: 150,
      areaIrrigada: 120,
      culturasExploradas: ["Tomate", "Melão"],
      tipoIrrigacao: "Gotejamento",
      observacoes: "Propriedade com boa infraestrutura",
      areasCadastradas: 2,
    },
    {
      id: "2",
      nome: "Fazenda São José",
      proprietario: "Maria Santos",
      tecnicoResponsavel: "Ana Pereira",
      telefoneContato: "(88) 98888-8888",
      emailResponsavel: "maria.santos@email.com",
      municipio: "Limoeiro do Norte",
      estado: "CE",
      latitude: "-5.2345",
      longitude: "-38.6789",
      areaTotal: 200,
      areaIrrigada: 180,
      culturasExploradas: ["Banana", "Mamão"],
      tipoIrrigacao: "Microaspersão",
      observacoes: "",
      areasCadastradas: 0,
    },
  ])

  const filteredPropriedades = propriedades.filter(
    (prop) =>
      prop.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.municipio.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <LayoutWrapper activeItem="fazendas">
      <div className="flex flex-col h-full">
        <header className="bg-teal-600 text-white p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h1 className="text-xl md:text-2xl font-bold ml-12 md:ml-0">Propriedades Agrícolas</h1>
            <div className="flex gap-2">
              <div className="relative flex-1 md:w-64">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar propriedades..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white"
                />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6">
          <Button
            className="w-full md:w-auto bg-teal-600 hover:bg-teal-700 text-white rounded-md flex items-center justify-center gap-2 py-6 md:py-3 md:px-6"
            onClick={() => router.push("/propriedades/nova")}
          >
            <PlusIcon className="h-5 w-5" />
            <span>Nova propriedade agrícola</span>
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPropriedades.map((propriedade) => (
              <Card
                key={propriedade.id}
                className="p-4 md:p-6 bg-teal-50 hover:bg-teal-100 transition-colors cursor-pointer"
                onClick={() => router.push(`/areas/${propriedade.id}`)}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <h3 className="font-medium text-gray-900 text-lg">{propriedade.nome}</h3>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Proprietário:</span> {propriedade.proprietario}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Localização:</span> {propriedade.municipio}, {propriedade.estado}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Áreas cadastradas:</span> {propriedade.areasCadastradas}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Área total:</span> {propriedade.areaTotal} ha
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-teal-600 hover:bg-teal-200"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/propriedades/${propriedade.id}/editar`)
                    }}
                  >
                    <PencilIcon className="h-5 w-5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {filteredPropriedades.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhuma propriedade encontrada.</p>
            </div>
          )}
        </main>
      </div>
    </LayoutWrapper>
  )
}
