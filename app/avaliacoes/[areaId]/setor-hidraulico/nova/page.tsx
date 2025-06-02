"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { NavBar } from "@/components/nav-bar"
import { ChevronLeft } from "lucide-react"
import { AvaliacaoGrid } from "@/components/avaliacao-grid"
import { ComentariosSection } from "@/components/comentarios-section"

interface Comentario {
  id: string
  texto: string
  imagem?: string
}

export default function NovaAvaliacaoSetorHidraulico({ params }: { params: { areaId: string } }) {
  const router = useRouter()
  const [pontosAvaliados, setPontosAvaliados] = useState<{ [key: string]: boolean }>({
    "2-2": true,
    "2-3": true,
    "3-0": true,
    "3-1": true,
    "3-2": true,
    "3-3": true,
  })

  const [comentarios, setComentarios] = useState<Comentario[]>([
    {
      id: "1",
      texto: "Gotejamento no ponto X está entupido. Trocar filtro",
      imagem: "/placeholder.svg?height=100&width=200",
    },
  ])

  const handlePontoAvaliado = (linha: number, coluna: number, avaliado: boolean) => {
    const key = `${linha}-${coluna}`
    setPontosAvaliados((prev) => ({
      ...prev,
      [key]: avaliado,
    }))
  }

  const adicionarComentario = (texto: string, imagem?: string) => {
    const novoComentario = {
      id: Date.now().toString(),
      texto,
      imagem,
    }
    setComentarios((prev) => [...prev, novoComentario])
  }

  const handleSalvarAvaliacao = () => {
    // Aqui seria a integração com o backend para salvar a avaliação
    console.log("Salvando avaliação:", { pontosAvaliados, comentarios })
    router.push(`/avaliacoes/${params.areaId}`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-teal-600 text-white p-4">
        <h1 className="text-xl font-bold">Nova avaliação</h1>
      </header>

      <div className="p-4">
        <Button variant="ghost" className="flex items-center text-gray-700 mb-4" onClick={() => router.back()}>
          <ChevronLeft className="h-5 w-5 mr-1" />
          <span>voltar</span>
        </Button>
      </div>

      <main className="flex-1 px-4 space-y-6 pb-20">
        <AvaliacaoGrid onPontoAvaliado={handlePontoAvaliado} pontosAvaliados={pontosAvaliados} />

        <ComentariosSection comentarios={comentarios} onAdicionarComentario={adicionarComentario} />

        <div className="pt-4">
          <Button onClick={handleSalvarAvaliacao} className="w-full bg-teal-600 hover:bg-teal-700 text-white">
            Finalizar Avaliação
          </Button>
        </div>
      </main>

      <NavBar activeItem="areas" />
    </div>
  )
}
