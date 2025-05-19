"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { NavBar } from "@/components/nav-bar"
import { PlusIcon, SearchIcon, PencilIcon } from "lucide-react"

interface Fazenda {
  id: string
  nome: string
  localizacao: string
  areasCadastradas: number
}

export default function Fazendas() {
  const [fazendas, setFazendas] = useState<Fazenda[]>([
    {
      id: "1",
      nome: "Tabuleiro de Russas",
      localizacao: "Tabuleiro do Norte",
      areasCadastradas: 2,
    },
    {
      id: "2",
      nome: "Fazenda São José",
      localizacao: "Tabuleiro do Norte",
      areasCadastradas: 0,
    },
  ])

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-teal-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Fazendas</h1>
        <Button variant="ghost" size="icon" className="text-white">
          <SearchIcon className="h-5 w-5" />
        </Button>
      </header>

      <main className="flex-1 p-4 space-y-4">
        <Button
          className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-md flex items-center justify-center gap-2 py-6"
          onClick={() => {
            /* Adicionar nova fazenda */
          }}
        >
          <PlusIcon className="h-5 w-5" />
          <span>Nova fazenda</span>
        </Button>

        <div className="space-y-3">
          {fazendas.map((fazenda) => (
            <Link href={`/areas/${fazenda.id}`} key={fazenda.id}>
              <Card className="p-4 bg-teal-50 hover:bg-teal-100 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="font-medium text-gray-900">{fazenda.nome}</h3>
                    <p className="text-sm text-gray-600">Localização: {fazenda.localizacao}</p>
                    <p className="text-sm text-gray-600">Áreas cadastradas: {fazenda.areasCadastradas}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-teal-600">
                    <PencilIcon className="h-5 w-5" />
                  </Button>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </main>

      <NavBar activeItem="fazendas" />
    </div>
  )
}
