"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { ChevronLeft, Upload, Calculator, Trash } from "lucide-react"
import { TabelaVolumesPivoV2 } from "@/components/tabela-volumes-pivo-v2"
import { ComentariosSection } from "@/components/comentarios-section"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface DadosPivo {
  nomeAvaliacao: string
  diametroColetor: number
}

interface VolumeData {
  coletor: string
  distancia: number
  volume: number | null
  observacoes: string
}

interface RaioAvaliacao {
  id: string
  raio: number
  coletores: VolumeData[]
}

interface Comentario {
  id: string
  texto: string
  imagem?: string
}

export default function NovaAvaliacaoPivoCentral({ params }: { params: { areaId: string } }) {
  const router = useRouter()
  const [dadosPivo, setDadosPivo] = useState<DadosPivo>({
    nomeAvaliacao: "",
    diametroColetor: 8,
  })

  const [raiosAvaliacao, setRaiosAvaliacao] = useState<RaioAvaliacao[]>([])
  const [comentarios, setComentarios] = useState<Comentario[]>([])
  const [erro, setErro] = useState<string | null>(null)

  // Calcula a área do coletor
  const calcularAreaColetor = (diametro: number): number => {
    return Math.PI * Math.pow(diametro / 2, 2)
  }

  const areaColetor = calcularAreaColetor(dadosPivo.diametroColetor)

  const handleDadosChange = (field: keyof DadosPivo, value: string | number) => {
    setDadosPivo((prev) => ({
      ...prev,
      [field]: value,
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

  const handleImportarCSV = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".csv,.xlsx,.xls"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        console.log("Importando arquivo:", file.name)
        // Implementar lógica de importação aqui
      }
    }
    input.click()
  }

  const handleLimparFormulario = () => {
    setRaiosAvaliacao([])
    setComentarios([])
    setErro(null)
  }

  const validarDados = (): boolean => {
    if (!dadosPivo.nomeAvaliacao.trim()) {
      setErro("Por favor, preencha o nome da avaliação")
      return false
    }

    if (raiosAvaliacao.length === 0) {
      setErro("Por favor, adicione pelo menos um raio de avaliação")
      return false
    }

    // Verificar se pelo menos 80% dos volumes foram preenchidos para cada raio
    for (const raio of raiosAvaliacao) {
      const volumesPreenchidos = raio.coletores.filter((c) => c.volume !== null && c.volume > 0).length
      const percentualPreenchido = (volumesPreenchidos / raio.coletores.length) * 100

      if (percentualPreenchido < 80) {
        setErro(`Por favor, preencha ao menos 80% dos coletores no raio ${raio.raio}m`)
        return false
      }
    }

    setErro(null)
    return true
  }

  const handleCalcularMetricas = () => {
    if (!validarDados()) return

    const dadosAvaliacao = {
      dadosPivo,
      raiosAvaliacao,
      comentarios,
      areaColetor,
      dataAvaliacao: new Date().toISOString(),
    }

    console.log("Dados da avaliação:", dadosAvaliacao)
    localStorage.setItem("avaliacaoPivoV2", JSON.stringify(dadosAvaliacao))
    router.push(`/avaliacoes/${params.areaId}/pivo-central/resultado`)
  }

  return (
    <LayoutWrapper activeItem="areas" showNavBar={false}>
      <div className="flex flex-col h-full">
        <header className="bg-teal-600 text-white p-4 flex items-center gap-4">
          <Button variant="ghost" className="text-white p-0 h-9 w-9 md:hidden" onClick={() => router.back()}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg md:text-xl font-bold">Avaliação de Pivô Central</h1>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 space-y-6 max-w-6xl mx-auto w-full">
          {/* Seção Dados do Pivô */}
          <Card className="p-4 md:p-6 shadow-md">
            <h2 className="text-xl font-bold mb-4">Dados do Pivô</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nomeAvaliacao">Nome da Avaliação *</Label>
                <Input
                  id="nomeAvaliacao"
                  placeholder="Ex: Safra 2025 – Pivô 01"
                  value={dadosPivo.nomeAvaliacao}
                  onChange={(e) => handleDadosChange("nomeAvaliacao", e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="diametroColetor">Diâmetro do Coletor (cm)</Label>
                  <Input
                    id="diametroColetor"
                    type="number"
                    min="1"
                    max="100"
                    value={dadosPivo.diametroColetor}
                    onChange={(e) => handleDadosChange("diametroColetor", Number.parseInt(e.target.value) || 8)}
                    className="h-12"
                  />
                </div>

                <div className="flex items-end">
                  <div className="p-3 bg-gray-100 rounded-md w-full">
                    <p className="text-sm font-medium text-gray-700">Área do Coletor: {areaColetor.toFixed(2)} cm²</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Seção Raios de Avaliação */}
          <Card className="p-4 md:p-6 shadow-md">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h2 className="text-xl font-bold">Raios de Avaliação</h2>
              <Button variant="outline" onClick={handleImportarCSV} className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Importar CSV/Excel
              </Button>
            </div>

            <TabelaVolumesPivoV2
              raiosAvaliacao={raiosAvaliacao}
              onRaiosChange={setRaiosAvaliacao}
              diametroColetor={dadosPivo.diametroColetor}
            />
          </Card>

          {/* Seção Comentários */}
          <Card className="p-4 md:p-6 shadow-md">
            <ComentariosSection comentarios={comentarios} onAdicionarComentario={adicionarComentario} />
          </Card>

          {erro && (
            <Alert variant="destructive">
              <AlertDescription>{erro}</AlertDescription>
            </Alert>
          )}

          {/* Rodapé de Ações */}
          <div className="flex flex-col md:flex-row gap-4 justify-center pb-6">
            <Button
              onClick={handleCalcularMetricas}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-6 py-3 h-12"
            >
              <Calculator className="h-4 w-4" />
              Calcular CUC e CUD
            </Button>

            <Button
              variant="outline"
              onClick={handleLimparFormulario}
              className="border-gray-400 text-gray-700 hover:bg-gray-100 flex items-center gap-2 px-6 py-3 h-12"
            >
              <Trash className="h-4 w-4" />
              Limpar Formulário
            </Button>

            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-red-600 hover:bg-red-50 px-6 py-3 h-12"
            >
              Cancelar/Voltar
            </Button>
          </div>
        </main>
      </div>
    </LayoutWrapper>
  )
}
