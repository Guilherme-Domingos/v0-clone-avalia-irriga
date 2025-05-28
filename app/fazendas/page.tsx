"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { NavBar } from "@/components/nav-bar"
import { PlusIcon, SearchIcon, PencilIcon } from "lucide-react"
import type { PropriedadeAgricola } from "@/app/types"

export default function PropriedadesAgricolas() {
  const router = useRouter()
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-teal-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Propriedades Agrícolas</h1>
        <Button variant="ghost" size="icon" className="text-white">
          <SearchIcon className="h-5 w-5" />
        </Button>
      </header>

      <main className="flex-1 p-4 space-y-4">
        <Button
          className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-md flex items-center justify-center gap-2 py-6"
          onClick={() => router.push("/propriedades/nova")}
        >
          <PlusIcon className="h-5 w-5" />
          <span>Nova propriedade agrícola</span>
        </Button>

        <div className="space-y-3">
          {propriedades.map((propriedade) => (
            <Card
              key={propriedade.id}
              className="p-4 bg-teal-50 hover:bg-teal-100 transition-colors cursor-pointer"
              onClick={() => router.push(`/areas/${propriedade.id}`)}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-medium text-gray-900">{propriedade.nome}</h3>
                  <p className="text-sm text-gray-600">
                    Município: {propriedade.municipio}, {propriedade.estado}
                  </p>
                  <p className="text-sm text-gray-600">Áreas cadastradas: {propriedade.areasCadastradas}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-teal-600"
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
      </main>

      <NavBar activeItem="fazendas" />
    </div>
  )
}
