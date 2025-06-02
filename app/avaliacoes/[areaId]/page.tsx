"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { NavBar } from "@/components/nav-bar"
import { PlusIcon, PencilIcon, ChevronLeft } from "lucide-react"
import type { Unidade } from "@/app/types"

interface Avaliacao {
  id: string
  nome: string
  data: string
}

export default function Avaliacoes({ params }: { params: { areaId: string } }) {
  const router = useRouter()
  const [unidade, setUnidade] = useState<Unidade | null>(null)
  const [loading, setLoading] = useState(true)

  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([
    { id: "1", nome: "Avaliação 01", data: "01/01/2020" },
    { id: "2", nome: "Avaliação 02", data: "05/05/2020" },
  ])

  // Simula busca dos dados da unidade (em um app real, seria uma chamada para o backend)
  useEffect(() => {
    // Dados simulados das unidades
    const unidadesSimuladas: Unidade[] = [
      { id: "1", nome: "Setor Hidráulico 1 - Tomates", tipo: "setor-hidraulico", propriedadeId: "1" },
      { id: "2", nome: "Pivô Central 1 - Laranjas", tipo: "pivo-central", propriedadeId: "1" },
    ]

    const unidadeEncontrada = unidadesSimuladas.find((u) => u.id === params.areaId)
    setUnidade(unidadeEncontrada || null)
    setLoading(false)
  }, [params.areaId])

  const handleNovaAvaliacao = () => {
    if (unidade?.tipo === "pivo-central") {
      router.push(`/avaliacoes/${params.areaId}/pivo-central/nova`)
    } else {
      router.push(`/avaliacoes/${params.areaId}/setor-hidraulico/nova`)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <header className="bg-teal-600 text-white p-4">
          <h1 className="text-xl font-bold">Carregando...</h1>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-teal-600 text-white p-4">
        <h1 className="text-xl font-bold">{unidade?.nome || "Unidade"}</h1>
      </header>

      <div className="p-4">
        <Button variant="ghost" className="flex items-center text-gray-700 mb-4" onClick={() => router.back()}>
          <ChevronLeft className="h-5 w-5 mr-1" />
          <span>voltar</span>
        </Button>
      </div>

      <main className="flex-1 px-4 space-y-4">
        <Button
          className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-md flex items-center justify-center gap-2 py-6"
          onClick={handleNovaAvaliacao}
        >
          <PlusIcon className="h-5 w-5" />
          <span>Nova avaliação</span>
        </Button>

        <div className="space-y-3">
          {avaliacoes.map((avaliacao) => (
            <Link
              href={
                unidade?.tipo === "pivo-central"
                  ? `/avaliacoes/${params.areaId}/pivo-central/${avaliacao.id}`
                  : `/avaliacoes/${params.areaId}/${avaliacao.id}`
              }
              key={avaliacao.id}
            >
              <Card className="p-4 bg-teal-50 hover:bg-teal-100 transition-colors">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-900">
                    {avaliacao.nome} - {avaliacao.data}
                  </h3>
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
