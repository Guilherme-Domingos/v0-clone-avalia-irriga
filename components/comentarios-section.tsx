"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Upload } from "lucide-react"
import Image from "next/image"

interface Comentario {
  id: string
  texto: string
  imagem?: string
}

interface ComentariosSectionProps {
  comentarios: Comentario[]
  onAdicionarComentario: (texto: string, imagem?: string) => void
}

export function ComentariosSection({ comentarios, onAdicionarComentario }: ComentariosSectionProps) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [novoComentario, setNovoComentario] = useState("")
  const [imagemSelecionada, setImagemSelecionada] = useState<string | null>(null)

  const handleAdicionarComentario = () => {
    if (novoComentario.trim()) {
      onAdicionarComentario(novoComentario, imagemSelecionada || undefined)
      setNovoComentario("")
      setImagemSelecionada(null)
      setMostrarFormulario(false)
    }
  }

  const handleImagemUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Em um app real, aqui seria feito o upload da imagem
      // Por enquanto, vamos usar um placeholder
      setImagemSelecionada("/placeholder.svg?height=100&width=200")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Recomendações/Comentários</h3>
        <Button
          size="sm"
          className="bg-teal-600 hover:bg-teal-700 text-white"
          onClick={() => setMostrarFormulario(true)}
        >
          Novo
        </Button>
      </div>

      {/* Lista de comentários existentes */}
      <div className="space-y-2">
        {comentarios.map((comentario) => (
          <Card key={comentario.id} className="p-3 bg-gray-200">
            <p className="text-sm">{comentario.texto}</p>
            {comentario.imagem && (
              <div className="mt-2">
                <Image
                  src={comentario.imagem || "/placeholder.svg"}
                  alt="Imagem do comentário"
                  width={200}
                  height={100}
                  className="rounded-md"
                />
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Formulário para novo comentário */}
      {mostrarFormulario && (
        <Card className="p-4 border-teal-200">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Novo Comentário</h4>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setMostrarFormulario(false)
                  setNovoComentario("")
                  setImagemSelecionada(null)
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comentario">Comentário</Label>
              <Textarea
                id="comentario"
                value={novoComentario}
                onChange={(e) => setNovoComentario(e.target.value)}
                placeholder="Digite seu comentário ou recomendação..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imagem">Imagem (opcional)</Label>
              <div className="flex items-center gap-2">
                <Input id="imagem" type="file" accept="image/*" onChange={handleImagemUpload} className="hidden" />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("imagem")?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Selecionar imagem
                </Button>
                {imagemSelecionada && <span className="text-sm text-green-600">Imagem selecionada</span>}
              </div>
            </div>

            {imagemSelecionada && (
              <div className="mt-2">
                <Image
                  src={imagemSelecionada || "/placeholder.svg"}
                  alt="Prévia da imagem"
                  width={200}
                  height={100}
                  className="rounded-md"
                />
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setMostrarFormulario(false)
                  setNovoComentario("")
                  setImagemSelecionada(null)
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAdicionarComentario}
                disabled={!novoComentario.trim()}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
              >
                Adicionar
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
