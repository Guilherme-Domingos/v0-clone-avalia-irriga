"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { NavBar } from "@/components/nav-bar"
import { ChevronLeft, Upload, Calculator, Trash } from "lucide-react"
import { TabelaVolumesPivo } from "@/components/tabela-volumes-pivo"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface DadosPivo {
  nomeAvaliacao: string
  diametroColetor: number
  numeroRaios: number
}

interface VolumeData {
  raio: string
  distancia: number
  volume: number | null
  observacoes: string
}

export default function NovaAvaliacaoPivoCentral({ params }: { params: { areaId: string } }) {
  const router = useRouter()
  const [dadosPivo, setDadosPivo] = useState<DadosPivo>({
    nomeAvaliacao: "",
    diametroColetor: 8,
    numeroRaios: 3,
  })

  const [volumes, setVolumes] = useState<VolumeData[]>([])
  const [erro, setErro] = useState<string | null>(null)

  // Calcula a área do coletor
  const calcularAreaColetor = (diametro: number): number => {
    return Math.PI * Math.pow(diametro / 2, 2)
  }

  const areaColetor = calcularAreaColetor(dadosPivo.diametroColetor)

  // Inicializa a tabela de volumes com distâncias padrão
  useEffect(() => {
    const distancias = Array.from({ length: 56 }, (_, i) => (i + 1) * 10) // 10m até 560m
    const raios = Array.from({ length: dadosPivo.numeroRaios }, (_, i) => `R${i + 1}`)

    const novosVolumes: VolumeData[] = []

    for (const raio of raios) {
      for (const distancia of distancias) {
        novosVolumes.push({
          raio,
          distancia,
          volume: null,
          observacoes: "",
        })
      }
    }

    setVolumes(novosVolumes)
  }, [dadosPivo.numeroRaios])

  const handleDadosChange = (field: keyof DadosPivo, value: string | number) => {
    setDadosPivo((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImportarCSV = () => {
    // Simula importação de CSV
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".csv,.xlsx,.xls"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        // Aqui seria implementada a lógica de leitura do arquivo
        console.log("Importando arquivo:", file.name)
        // Por enquanto, vamos simular alguns dados
        const dadosSimulados: VolumeData[] = [
          { raio: "R1", distancia: 10, volume: 315, observacoes: "" },
          { raio: "R1", distancia: 20, volume: 308, observacoes: "" },
          { raio: "R2", distancia: 10, volume: 295, observacoes: "" },
          { raio: "R2", distancia: 20, volume: 302, observacoes: "Vento forte" },
        ]

        // Atualiza os volumes existentes com os dados importados
        const novosVolumes = [...volumes]
        for (const dado of dadosSimulados) {
          const index = novosVolumes.findIndex((v) => v.raio === dado.raio && v.distancia === dado.distancia)
          if (index !== -1) {
            novosVolumes[index] = dado
          }
        }

        setVolumes(novosVolumes)
      }
    }
    input.click()
  }

  const handleLimparFormulario = () => {
    // Limpa apenas os volumes e observações, mantendo os dados do pivô
    const novosVolumes = volumes.map((v) => ({
      ...v,
      volume: null,
      observacoes: "",
    }))
    setVolumes(novosVolumes)
    setErro(null)
  }

  const validarDados = (): boolean => {
    if (!dadosPivo.nomeAvaliacao.trim()) {
      setErro("Por favor, preencha o nome da avaliação")
      return false
    }

    // Verificar se pelo menos 80% dos volumes foram preenchidos para cada raio
    const raios = Array.from({ length: dadosPivo.numeroRaios }, (_, i) => `R${i + 1}`)
    const distancias = Array.from({ length: 56 }, (_, i) => (i + 1) * 10) // 10m até 560m
    const totalPontosPorRaio = distancias.length

    for (const raio of raios) {
      const volumesRaio = volumes.filter((v) => v.raio === raio && v.volume !== null && v.volume > 0)
      const percentualPreenchido = (volumesRaio.length / totalPontosPorRaio) * 100

      if (percentualPreenchido < 80) {
        setErro(`Por favor, preencha ao menos 80% dos volumes no ${raio}`)
        return false
      }
    }

    setErro(null)
    return true
  }

  const handleCalcularMetricas = () => {
    if (!validarDados()) return

    // Salvar dados e navegar para a tela de resultados
    const dadosAvaliacao = {
      dadosPivo,
      volumes,
      areaColetor,
      dataAvaliacao: new Date().toISOString(),
    }

    // Aqui seria salvo no estado global ou enviado para o backend
    console.log("Dados da avaliação:", dadosAvaliacao)

    // Armazenar temporariamente no localStorage para a tela de resultados
    localStorage.setItem("avaliacaoPivo", JSON.stringify(dadosAvaliacao))

    // Navegar para a tela de resultados
    router.push(`/avaliacoes/${params.areaId}/pivo-central/resultado`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-teal-600 text-white p-4 flex justify-between items-center">
        <Button variant="ghost" className="text-white p-0 h-9 w-9" onClick={() => router.back()}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Avaliação de Pivô Central</h1>
        <div className="w-9"></div>
      </header>

      <main className="flex-1 p-4 space-y-6 max-w-5xl mx-auto w-full">
        {/* Seção Dados do Pivô */}
        <Card className="p-4 shadow-md">
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numeroRaios">Número de Raios</Label>
                <Input
                  id="numeroRaios"
                  type="number"
                  min="1"
                  max="5"
                  value={dadosPivo.numeroRaios}
                  onChange={(e) => handleDadosChange("numeroRaios", Number.parseInt(e.target.value) || 3)}
                />
              </div>
            </div>

            <div className="p-3 bg-gray-100 rounded-md">
              <p className="text-sm font-medium text-gray-700">Área do Coletor: {areaColetor.toFixed(2)} cm²</p>
            </div>
          </div>
        </Card>

        {/* Seção Volumes Coletados */}
        <Card className="p-4 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Volumes Coletados</h2>
            <Button variant="outline" onClick={handleImportarCSV} className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Importar CSV/Excel
            </Button>
          </div>

          <TabelaVolumesPivo numeroRaios={dadosPivo.numeroRaios} volumes={volumes} onVolumesChange={setVolumes} />
        </Card>

        {erro && (
          <Alert variant="destructive">
            <AlertDescription>{erro}</AlertDescription>
          </Alert>
        )}

        {/* Rodapé de Ações */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleCalcularMetricas}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-6 py-3"
          >
            <Calculator className="h-4 w-4" />
            Calcular CUC e CUD
          </Button>

          <Button
            variant="outline"
            onClick={handleLimparFormulario}
            className="border-gray-400 text-gray-700 hover:bg-gray-100 flex items-center gap-2 px-6 py-3"
          >
            <Trash className="h-4 w-4" />
            Limpar Formulário
          </Button>

          <Button variant="ghost" onClick={() => router.back()} className="text-red-600 hover:bg-red-50 px-6 py-3">
            Cancelar/Voltar
          </Button>
        </div>
      </main>

      <NavBar activeItem="areas" />
    </div>
  )
}
