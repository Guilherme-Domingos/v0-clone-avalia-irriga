"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { NavBar } from "@/components/nav-bar"
import { ChevronLeft } from "lucide-react"
import { IrrigationGrid } from "@/components/irrigation-grid"
import { CommentsList } from "@/components/comments-list"
import { VolumeTable } from "@/components/volume-table"

export default function NovaAvaliacao({ params }: { params: { areaId: string } }) {
  const router = useRouter()
  const [comments, setComments] = useState<string[]>(["Gotejamento no ponto X está entupido. Trocar filtro"])

  const addComment = (comment: string) => {
    setComments([...comments, comment])
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

      <main className="flex-1 px-4 space-y-6">
        <IrrigationGrid />

        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Recomendações/Comentários</h3>
            <Button
              size="sm"
              className="bg-teal-600 hover:bg-teal-700 text-white"
              onClick={() => {
                /* Adicionar comentário */
              }}
            >
              Novo
            </Button>
          </div>

          <CommentsList comments={comments} />
        </div>

        <VolumeTable />
      </main>

      <NavBar activeItem="areas" />
    </div>
  )
}
