"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PencilIcon } from "lucide-react"

interface FazendaCardProps {
  id: string
  nome: string
  localizacao: string
  areasCadastradas: number
  onClick: () => void
}

export function FazendaCard({ id, nome, localizacao, areasCadastradas, onClick }: FazendaCardProps) {
  return (
    <Card className="p-4 bg-teal-50 hover:bg-teal-100 transition-colors cursor-pointer" onClick={onClick}>
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="font-medium text-gray-900">{nome}</h3>
          <p className="text-sm text-gray-600">Localização: {localizacao}</p>
          <p className="text-sm text-gray-600">Áreas cadastradas: {areasCadastradas}</p>
        </div>
        <Button variant="ghost" size="icon" className="text-teal-600">
          <PencilIcon className="h-5 w-5" />
        </Button>
      </div>
    </Card>
  )
}
