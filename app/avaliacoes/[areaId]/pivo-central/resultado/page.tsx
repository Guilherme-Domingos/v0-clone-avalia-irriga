"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { NavBar } from "@/components/nav-bar"
import { ChevronLeft, Download, BarChart, Calendar, Lightbulb } from "lucide-react"
import { GraficoDistribuicaoLamina } from "@/components/grafico-distribuicao-lamina"
import { TabelaDadosDetalhada } from "@/components/tabela-dados-detalhada"
import { calcularCUC, calcularCUD } from "@/lib/utils"

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

interface ResultadoMetricas {
  dataAvaliacao: string
  diametroColetor: number
  numeroRaios: number
  mediaGeralLamina: number
  cucGeral: number
  cudGeral: number
  metricasPorRaio: {
    raio: string
    mediaLamina: number
    cuc: number
    cud: number
  }[]
  dadosDetalhados: Array<{
    raio: string
    distancia: number
    volume: number
    lamina: number
    diferencaMedia: number
  }>
}

export default function ResultadoAvaliacaoPivo({ params }: { params: { areaId: string } }) {
  const router = useRouter()
  const [resultados, setResultados] = useState<ResultadoMetricas | null>(null)
  const [loading, setLoading] = useState(true)
  const [nomeAvaliacao, setNomeAvaliacao] = useState("Avaliação de Pivô")

  useEffect(() => {
    // Recuperar dados da avaliação do localStorage
    const dadosString = localStorage.getItem("avaliacaoPivo")
    if (!dadosString) {
      // Se não houver dados, usar dados simulados
      simularResultados()
      return
    }

    try {
      const dados = JSON.parse(dadosString)
      setNomeAvaliacao(dados.dadosPivo.nomeAvaliacao)

      // Calcular métricas
      const metricas = calcularMetricas(dados)
      setResultados(metricas)
    } catch (error) {
      console.error("Erro ao processar dados da avaliação:", error)
      simularResultados()
    } finally {
      setLoading(false)
    }
  }, [])

  const simularResultados = () => {
    // Dados simulados para demonstração
    setResultados({
      dataAvaliacao: new Date().toLocaleDateString("pt-BR"),
      diametroColetor: 8,
      numeroRaios: 3,
      mediaGeralLamina: 23.45,
      cucGeral: 87.45,
      cudGeral: 68.2,
      metricasPorRaio: [
        { raio: "R1", mediaLamina: 25.1, cuc: 89.3, cud: 72.15 },
        { raio: "R2", mediaLamina: 24.2, cuc: 88.75, cud: 69.8 },
        { raio: "R3", mediaLamina: 22.35, cuc: 85.12, cud: 62.65 },
      ],
      dadosDetalhados: [
        { raio: "R1", distancia: 10, volume: 315, lamina: 25.1, diferencaMedia: 5.23 },
        { raio: "R1", distancia: 20, volume: 308, lamina: 24.55, diferencaMedia: 3.76 },
        { raio: "R2", distancia: 10, volume: 295, lamina: 23.5, diferencaMedia: -0.21 },
        { raio: "R2", distancia: 20, volume: 302, lamina: 24.05, diferencaMedia: 2.13 },
        { raio: "R3", distancia: 10, volume: 280, lamina: 22.31, diferencaMedia: -5.12 },
        { raio: "R3", distancia: 20, volume: 275, lamina: 21.91, diferencaMedia: -6.82 },
      ],
    })
    setLoading(false)
  }

  const calcularMetricas = (dados: any): ResultadoMetricas => {
    const { dadosPivo, volumes, areaColetor, dataAvaliacao } = dados

    // Converter volumes para lâminas
    const dadosDetalhados = volumes
      .filter((v: VolumeData) => v.volume !== null && v.volume > 0)
      .map((v: VolumeData) => {
        const lamina = (v.volume! / areaColetor) * 10 // Fórmula: (volume_mL / area_cm²) * 10
        return {
          raio: v.raio,
          distancia: v.distancia,
          volume: v.volume!,
          lamina,
          diferencaMedia: 0, // Será calculado depois
        }
      })

    // Calcular média geral de lâmina
    const mediaGeralLamina = dadosDetalhados.reduce((sum, d) => sum + d.lamina, 0) / dadosDetalhados.length

    // Calcular diferença percentual para a média
    dadosDetalhados.forEach((d) => {
      d.diferencaMedia = ((d.lamina - mediaGeralLamina) / mediaGeralLamina) * 100
    })

    // Calcular métricas por raio
    const raios = Array.from({ length: dadosPivo.numeroRaios }, (_, i) => `R${i + 1}`)
    const metricasPorRaio = raios.map((raio) => {
      const laminasRaio = dadosDetalhados.filter((d) => d.raio === raio).map((d) => d.lamina)

      const mediaLamina = laminasRaio.reduce((sum, l) => sum + l, 0) / laminasRaio.length
      const cuc = calcularCUC(laminasRaio)
      const cud = calcularCUD(laminasRaio)

      return { raio, mediaLamina, cuc, cud }
    })

    // Calcular CUC e CUD gerais
    const todasLaminas = dadosDetalhados.map((d) => d.lamina)
    const cucGeral = calcularCUC(todasLaminas)
    const cudGeral = calcularCUD(todasLaminas)

    return {
      dataAvaliacao: new Date(dataAvaliacao).toLocaleDateString("pt-BR"),
      diametroColetor: dadosPivo.diametroColetor,
      numeroRaios: dadosPivo.numeroRaios,
      mediaGeralLamina,
      cucGeral,
      cudGeral,
      metricasPorRaio,
      dadosDetalhados,
    }
  }

  const handleExportarRelatorio = () => {
    // Implementar exportação de relatório
    console.log("Exportando relatório...")
    alert("Função de exportação de relatório será implementada em breve.")
  }

  const getInterpretacaoAutomatica = (): string => {
    if (!resultados) return ""

    const { cucGeral, cudGeral, metricasPorRaio } = resultados
    let interpretacao = ""

    if (cucGeral < 90) {
      interpretacao += `A uniformidade (CUC) geral de ${cucGeral.toFixed(2)}% está abaixo do recomendável (90%), indicando necessidade de ajuste nos aspersores. `
    } else {
      interpretacao += `A uniformidade (CUC) geral de ${cucGeral.toFixed(2)}% está dentro do padrão recomendável. `
    }

    if (cudGeral < 70) {
      interpretacao += `O CUD geral de ${cudGeral.toFixed(2)}% sugere que 25% dos pontos coletados apresentaram lâmina muito baixa. `
    }

    const raioProblematico = metricasPorRaio.find((r) => r.cuc < 85)
    if (raioProblematico) {
      interpretacao += `Especial atenção ao ${raioProblematico.raio}, onde a média de lâmina foi ${raioProblematico.mediaLamina.toFixed(2)}mm e o CUC = ${raioProblematico.cuc.toFixed(2)}%. `
    }

    return interpretacao
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <header className="bg-teal-600 text-white p-4">
          <h1 className="text-xl font-bold">Carregando resultados...</h1>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      </div>
    )
  }

  if (!resultados) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <header className="bg-teal-600 text-white p-4">
          <h1 className="text-xl font-bold">Erro ao carregar resultados</h1>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="mb-4">Não foi possível carregar os resultados da avaliação.</p>
            <Button onClick={() => router.back()}>Voltar</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-teal-600 text-white p-4 flex justify-between items-center">
        <Button variant="ghost" className="text-white p-0 h-9 w-9" onClick={() => router.back()}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-bold truncate max-w-[200px] sm:max-w-md">Resultado: {nomeAvaliacao}</h1>
        <Button
          variant="outline"
          className="bg-teal-500 hover:bg-teal-600 text-white border-teal-400"
          onClick={handleExportarRelatorio}
        >
          <Download className="h-4 w-4 mr-1" />
          Exportar
        </Button>
      </header>

      <main className="flex-1 p-4 space-y-6 max-w-5xl mx-auto w-full">
        {/* Grid de Resumo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Card className="p-4 shadow-md rounded-2xl">
            <h3 className="font-bold text-center mb-2">Data da Avaliação</h3>
            <p className="text-center text-lg">{resultados.dataAvaliacao}</p>
          </Card>

          <Card className="p-4 shadow-md rounded-2xl">
            <h3 className="font-bold text-center mb-2">Diâmetro do Coletor</h3>
            <p className="text-center text-lg">{resultados.diametroColetor} cm</p>
          </Card>

          <Card className="p-4 shadow-md rounded-2xl">
            <h3 className="font-bold text-center mb-2">Número de Raios</h3>
            <p className="text-center text-lg">{resultados.numeroRaios}</p>
          </Card>

          <Card className="p-4 shadow-md rounded-2xl">
            <h3 className="font-bold text-center mb-2">Média Geral de Lâmina</h3>
            <p className="text-center text-lg">{resultados.mediaGeralLamina.toFixed(2)} mm</p>
          </Card>

          <Card className="p-4 shadow-md rounded-2xl">
            <h3 className="font-bold text-center mb-2">CUC Geral</h3>
            <p className="text-center text-lg">{resultados.cucGeral.toFixed(2)}%</p>
          </Card>

          <Card className="p-4 shadow-md rounded-2xl">
            <h3 className="font-bold text-center mb-2">CUD Geral</h3>
            <p className="text-center text-lg">{resultados.cudGeral.toFixed(2)}%</p>
          </Card>
        </div>

        {/* Gráfico de Distribuição */}
        <Card className="p-4 shadow-md">
          <h2 className="text-xl font-bold mb-4">Distribuição da Lâmina por Raio</h2>
          <GraficoDistribuicaoLamina
            metricasPorRaio={resultados.metricasPorRaio}
            dadosDetalhados={resultados.dadosDetalhados}
          />
        </Card>

        {/* Métricas por Raio */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Métricas por Raio</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {resultados.metricasPorRaio.map((metrica) => (
              <Card key={metrica.raio} className="p-4 shadow-md border border-gray-200">
                <h3 className="font-bold text-center mb-3">Raio {metrica.raio}</h3>
                <div className="space-y-2 text-center">
                  <p className="text-sm">
                    <span className="font-medium">Média de Lâmina:</span> {metrica.mediaLamina.toFixed(2)} mm
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">CUC ({metrica.raio}):</span> {metrica.cuc.toFixed(2)}%
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">CUD ({metrica.raio}):</span> {metrica.cud.toFixed(2)}%
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Interpretação Automática */}
        <Card className="p-4 shadow-md bg-yellow-50 border border-yellow-200">
          <div className="flex items-start gap-3">
            <div className="bg-yellow-400 rounded-full p-2 mt-1">
              <Lightbulb className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold mb-2">Interpretação Automática</h3>
              <p className="text-sm text-justify leading-relaxed">{getInterpretacaoAutomatica()}</p>
            </div>
          </div>
        </Card>

        {/* Tabela de Dados Detalhada */}
        <TabelaDadosDetalhada dadosDetalhados={resultados.dadosDetalhados} />

        {/* Rodapé de Ações */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" className="border-gray-400 text-gray-700 hover:bg-gray-100 flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Comparar com Avaliação Anterior
          </Button>

          <Button variant="outline" className="border-gray-400 text-gray-700 hover:bg-gray-100 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Agendar Manutenção
          </Button>

          <Button variant="ghost" onClick={() => router.push("/fazendas")} className="text-red-600 hover:bg-red-50">
            Voltar ao Menu
          </Button>
        </div>
      </main>

      <NavBar activeItem="areas" />
    </div>
  )
}
