"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

// Registra os componentes necessários do Chart.js
Chart.register(...registerables)

interface CudChartProps {
  data: {
    labels: string[]
    values: number[]
  }
}

export function CudChart({ data }: CudChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (chartRef.current) {
      // Destrói o gráfico anterior se existir
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      const ctx = chartRef.current.getContext("2d")

      if (ctx) {
        // Cria um novo gráfico
        chartInstance.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: data.labels,
            datasets: [
              {
                label: "CUD (%)",
                data: data.values,
                backgroundColor: data.values.map((value, index) =>
                  index === 1 ? "rgb(20, 130, 130)" : "rgb(100, 180, 180)",
                ),
                borderColor: "rgb(20, 130, 130)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: false,
                min: 80,
                max: 100,
              },
            },
            plugins: {
              legend: {
                display: false,
              },
            },
          },
        })
      }
    }

    // Limpa o gráfico quando o componente for desmontado
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data])

  return (
    <div className="w-full">
      <canvas ref={chartRef} />
    </div>
  )
}
