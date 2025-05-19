"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { NavBar } from "@/components/nav-bar"
import { PlusIcon, SearchIcon, PencilIcon } from "lucide-react"

interface Area {
  id: string
  nome: string
}

export default function Areas({ params }: { params: { fazendaId: string } }) {
  const router = useRouter()
  const [areas, setAreas] = useState<Area[]>([
    { id: "1", nome: "Talhão 1 - Tomates" },
    { id: "2", nome: "Talhão 2 - Laranjas" },
  ])

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-teal-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Tabuleiro de Russas</h1>
        <Button variant="ghost" size="icon" className="text-white">
          <SearchIcon className="h-5 w-5" />
        </Button>
      </header>

      <main className="flex-1 p-4 space-y-4">
        <Button
          className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-md flex items-center justify-center gap-2 py-6"
          onClick={() => {
            /* Adicionar nova área */
          }}
        >
          <PlusIcon className="h-5 w-5" />
          <span>Nova área</span>
        </Button>

        <div className="space-y-3">
          {areas.map((area) => (
            <Link href={`/avaliacoes/${area.id}`} key={area.id}>
              <Card className="p-4 bg-teal-50 hover:bg-teal-100 transition-colors">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-900">{area.nome}</h3>
                  <Button variant="ghost" size="icon" className="text-teal-600">
                    <PencilIcon className="h-5 w-5" />
                  </Button>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </main>

      <NavBar activeItem="areas" />
    </div>
  )
}
