"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft } from "lucide-react"
import { NavBar } from "@/components/nav-bar"
import type { SetorHidraulico } from "@/app/types"

// Tipos de emissores comuns
const tiposEmissores = [
  "Gotejador autocompensante",
  "Gotejador não-compensante",
  "Microaspersor",
  "Aspersor",
  "Fita gotejadora",
  "Outro",
]

// Tipos de filtros comuns
const tiposFiltros = ["Tela", "Disco", "Areia", "Hidrociclone", "Combinado", "Outro"]

// Tipos de válvulas comuns
const tiposValvulas = ["Hidráulica", "Elétrica", "Manual", "Solenóide", "Outro"]

// Tipos de energia
const tiposEnergia = ["Elétrica monofásica", "Elétrica trifásica", "Diesel", "Solar", "Eólica", "Outro"]

// Frequências de manutenção
const frequenciasManutenção = ["Diária", "Semanal", "Quinzenal", "Mensal", "Trimestral", "Semestral", "Anual"]

// Condições gerais
const condicoesGerais = ["Excelente", "Boa", "Regular", "Ruim", "Péssima"]

// Dados simulados dos setores hidráulicos
const setoresSimulados: SetorHidraulico[] = [
  {
    id: "1",
    identificacao: "Setor Hidráulico 1 - Tomates",
    area: 5.5,
    tipoEmissor: "Gotejador autocompensante",
    fabricanteEmissor: "Netafim",
    modeloEmissor: "UniRam",
    vazaoNominal: 2.3,
    pressaoTrabalho: 10,
    distanciaEmissores: 0.3,
    distanciaLinhas: 1.5,
    tipoFiltro: "Disco",
    malhaFiltro: "120 mesh",
    pressaoEntrada: 15,
    tipoValvula: "Hidráulica",
    tipoEnergia: "Elétrica trifásica",
    condicoesGerais: "Boa",
    numeroEmissores: 2500,
    frequenciaManutenção: "Semanal",
    dataUltimaAvaliacao: "2024-01-15",
    propriedadeId: "1",
  },
]

export default function EditarSetorHidraulico({
  params,
}: {
  params: { propriedadeId: string; id: string }
}) {
  const router = useRouter()
  const [formData, setFormData] = useState<SetorHidraulico | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simula busca dos dados do setor hidráulico (em um app real, seria uma chamada para o backend)
    const setor = setoresSimulados.find((s) => s.id === params.id)

    if (setor) {
      setFormData(setor)
    }

    setLoading(false)
  }, [params.id])

  const handleChange = (field: keyof SetorHidraulico, value: any) => {
    if (formData) {
      setFormData({
        ...formData,
        [field]: value,
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData) return

    // Aqui seria a integração com o backend para atualizar o setor hidráulico
    console.log("Dados atualizados do setor hidráulico:", formData)

    // Redireciona para a lista de áreas
    router.push(`/areas/${params.propriedadeId}`)
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <header className="bg-teal-600 text-white p-4">
          <h1 className="text-xl font-bold">Carregando...</h1>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">Carregando dados do setor hidráulico...</div>
        </div>
      </div>
    )
  }

  if (!formData) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <header className="bg-teal-600 text-white p-4">
          <h1 className="text-xl font-bold">Setor não encontrado</h1>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p>Setor hidráulico não encontrado.</p>
            <Button onClick={() => router.push(`/areas/${params.propriedadeId}`)} className="mt-4">
              Voltar para unidades
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-teal-600 text-white p-4">
        <h1 className="text-xl font-bold">Editar Setor Hidráulico</h1>
      </header>

      <div className="p-4">
        <Button variant="ghost" className="flex items-center text-gray-700 mb-4" onClick={() => router.back()}>
          <ChevronLeft className="h-5 w-5 mr-1" />
          <span>voltar</span>
        </Button>
      </div>

      <main className="flex-1 px-4 pb-16">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-medium">Informações Básicas</h2>

              <div className="space-y-2">
                <Label htmlFor="identificacao">Identificação do setor hidráulico *</Label>
                <Input
                  id="identificacao"
                  value={formData.identificacao}
                  onChange={(e) => handleChange("identificacao", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="area">Área do setor (ha) *</Label>
                <Input
                  id="area"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.area}
                  onChange={(e) => handleChange("area", Number.parseFloat(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-medium">Informações do Emissor</h2>

              <div className="space-y-2">
                <Label htmlFor="tipoEmissor">Tipo de emissor *</Label>
                <Select value={formData.tipoEmissor} onValueChange={(value) => handleChange("tipoEmissor", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de emissor" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposEmissores.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fabricanteEmissor">Fabricante do emissor</Label>
                <Input
                  id="fabricanteEmissor"
                  value={formData.fabricanteEmissor}
                  onChange={(e) => handleChange("fabricanteEmissor", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="modeloEmissor">Modelo do emissor</Label>
                <Input
                  id="modeloEmissor"
                  value={formData.modeloEmissor}
                  onChange={(e) => handleChange("modeloEmissor", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vazaoNominal">Vazão nominal do emissor (L/h) *</Label>
                  <Input
                    id="vazaoNominal"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.vazaoNominal}
                    onChange={(e) => handleChange("vazaoNominal", Number.parseFloat(e.target.value))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pressaoTrabalho">Pressão de trabalho do emissor (mca) *</Label>
                  <Input
                    id="pressaoTrabalho"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.pressaoTrabalho}
                    onChange={(e) => handleChange("pressaoTrabalho", Number.parseFloat(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="distanciaEmissores">Distância entre emissores (m) *</Label>
                  <Input
                    id="distanciaEmissores"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.distanciaEmissores}
                    onChange={(e) => handleChange("distanciaEmissores", Number.parseFloat(e.target.value))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="distanciaLinhas">Distância entre linhas laterais (m) *</Label>
                  <Input
                    id="distanciaLinhas"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.distanciaLinhas}
                    onChange={(e) => handleChange("distanciaLinhas", Number.parseFloat(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="numeroEmissores">Número de emissores no setor</Label>
                <Input
                  id="numeroEmissores"
                  type="number"
                  min="0"
                  value={formData.numeroEmissores}
                  onChange={(e) => handleChange("numeroEmissores", Number.parseInt(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-medium">Sistema de Filtragem e Controle</h2>

              <div className="space-y-2">
                <Label htmlFor="tipoFiltro">Tipo de filtro utilizado *</Label>
                <Select value={formData.tipoFiltro} onValueChange={(value) => handleChange("tipoFiltro", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de filtro" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposFiltros.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="malhaFiltro">Malha do filtro / grau de filtragem</Label>
                <Input
                  id="malhaFiltro"
                  value={formData.malhaFiltro}
                  onChange={(e) => handleChange("malhaFiltro", e.target.value)}
                  placeholder="Ex: 120 mesh"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pressaoEntrada">Pressão de entrada no setor (mca) *</Label>
                <Input
                  id="pressaoEntrada"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.pressaoEntrada}
                  onChange={(e) => handleChange("pressaoEntrada", Number.parseFloat(e.target.value))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipoValvula">Tipo de válvula de controle</Label>
                <Select value={formData.tipoValvula} onValueChange={(value) => handleChange("tipoValvula", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de válvula" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposValvulas.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-medium">Informações Operacionais</h2>

              <div className="space-y-2">
                <Label htmlFor="tipoEnergia">Tipo de energia utilizada</Label>
                <Select value={formData.tipoEnergia} onValueChange={(value) => handleChange("tipoEnergia", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de energia" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposEnergia.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="condicoesGerais">Condições gerais do setor</Label>
                <Select
                  value={formData.condicoesGerais}
                  onValueChange={(value) => handleChange("condicoesGerais", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione as condições gerais" />
                  </SelectTrigger>
                  <SelectContent>
                    {condicoesGerais.map((condicao) => (
                      <SelectItem key={condicao} value={condicao}>
                        {condicao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequenciaManutenção">Frequência de manutenção / lavagem</Label>
                <Select
                  value={formData.frequenciaManutenção}
                  onValueChange={(value) => handleChange("frequenciaManutenção", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a frequência" />
                  </SelectTrigger>
                  <SelectContent>
                    {frequenciasManutenção.map((freq) => (
                      <SelectItem key={freq} value={freq}>
                        {freq}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataUltimaAvaliacao">Data da última avaliação técnica</Label>
                <Input
                  id="dataUltimaAvaliacao"
                  type="date"
                  value={formData.dataUltimaAvaliacao}
                  onChange={(e) => handleChange("dataUltimaAvaliacao", e.target.value)}
                />
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                Salvar Alterações
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full border-red-500 text-red-500 hover:bg-red-50"
                onClick={() => {
                  if (
                    confirm("Tem certeza que deseja excluir este setor hidráulico? Esta ação não pode ser desfeita.")
                  ) {
                    // Aqui seria a integração com o backend para excluir o setor
                    console.log("Excluindo setor hidráulico:", formData.id)
                    router.push(`/areas/${params.propriedadeId}`)
                  }
                }}
              >
                Excluir Setor Hidráulico
              </Button>
            </div>
          </form>
        </Card>
      </main>

      <NavBar activeItem="areas" />
    </div>
  )
}
