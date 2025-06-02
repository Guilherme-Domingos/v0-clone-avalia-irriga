"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

interface MetricaRaio {
  raio: string
  mediaLamina: number
  cuc: number
  cud: number
}

interface DadoDetalhado {
  raio: string
  distancia: number
  volume: number
  lamina: number
  diferencaMedia: number
}

interface GraficoDistribuicaoLaminaProps {
  metricasPorRaio: MetricaRaio[]
  dadosDetalhados: DadoDetalhado[]
}

export function GraficoDistribuicaoLamina({ metricasPorRaio, dadosDetalhados }: GraficoDistribuicaoLaminaProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      const ctx = chartRef.current.getContext("2d")

      if (ctx) {
        // Preparar dados para o gráfico
        const raios = [...new Set(dadosDetalhados.map((d) => d.raio))].sort()
        const distancias = [...new Set(dadosDetalhados.map((d) => d.distancia))].sort((a, b) => a - b)

        // Cores para cada raio
        const cores = {
          R1: "rgb(59, 130, 246)", // Azul
          R2: "rgb(249, 115, 22)", // Laranja
          R3: "rgb(34, 197, 94)", // Verde
          R4: "rgb(168, 85, 247)", // Roxo
          R5: "rgb(236, 72, 153)", // Rosa
        }

        // Criar datasets para cada raio
        const datasets = raios.map((raio) => {
          const dadosRaio = dadosDetalhados.filter((d) => d.raio === raio).sort((a, b) => a.distancia - b.distancia)

          return {
            label: raio,
            data: dadosRaio.map((d) => ({ x: d.distancia, y: d.lamina })),
            borderColor: cores[raio as keyof typeof cores] || "rgb(107, 114, 128)",
            backgroundColor: cores[raio as keyof typeof cores] || "rgb(107, 114, 128)",
            pointBackgroundColor: cores[raio as keyof typeof cores] || "rgb(107, 114, 128)",
            pointRadius: 4,
            tension: 0.1,
          }
        })

        chartInstance.current = new Chart(ctx, {
          type: "line",
          data: {
            datasets,
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                type: "linear",
                title: {
                  display: true,
                  text: "Distância ao pivô (m)",
                },
                grid: {
                  color: "rgba(0, 0, 0, 0.1)",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Lâmina (mm)",
                },
                grid: {
                  color: "rgba(0, 0, 0, 0.1)",
                },
              },
            },
            plugins: {
              legend: {
                position: "top",
                align: "end",
              },
              tooltip: {
                callbacks: {
                  title: (context) => {
                    const dataPoint = context[0]
                    const raio = dataPoint.dataset.label
                    const distancia = dataPoint.parsed.x
                    return `Raio: ${raio} | Distância: ${distancia} m`
                  },
                  label: (context) => {
                    const lamina = context.parsed.y.toFixed(2)

                    // Encontrar o volume correspondente
                    const raio = context.dataset.label
                    const distancia = context.parsed.x
                    const dadoPonto = dadosDetalhados.find((d) => d.raio === raio && d.distancia === distancia)

                    const volume = dadoPonto ? dadoPonto.volume : "N/A"

                    return [`Volume: ${volume} mL`, `Lâmina: ${lamina} mm`]
                  },
                },
              },
            },
          },
        })
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [dadosDetalhados, metricasPorRaio])

  return (
    <div className="w-full h-96 bg-gray-50 border border-gray-200 rounded-md p-4">
      <canvas ref={chartRef} />
    </div>
  )
}
