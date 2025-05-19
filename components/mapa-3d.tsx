"use client"

import { useEffect, useRef } from "react"
import Script from "next/script"

export function Mapa3D() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Esta função será chamada quando o Plotly estiver carregado
    const initPlot = () => {
      if (typeof window.Plotly !== "undefined" && containerRef.current) {
        // Dados simulados para o mapa 3D
        const gridSize = 10
        const x = Array.from({ length: gridSize }, (_, i) => i)
        const y = Array.from({ length: gridSize }, (_, i) => i)
        const z = Array.from({ length: gridSize }, (_, i) =>
          Array.from({ length: gridSize }, (_, j) => {
            // Cria uma superfície com variação de altura para simular distribuição de água
            const centerX = gridSize / 2
            const centerY = gridSize / 2
            const distFromCenter = Math.sqrt(Math.pow(i - centerX, 2) + Math.pow(j - centerY, 2))
            return 10 * Math.exp(-0.1 * distFromCenter) + Math.random() * 2
          }),
        )

        const data = [
          {
            type: "surface",
            x: x,
            y: y,
            z: z,
            colorscale: "Jet",
            contours: {
              z: {
                show: true,
                usecolormap: true,
                highlightcolor: "#42f462",
                project: { z: true },
              },
            },
          },
        ]

        const layout = {
          title: "",
          autosize: true,
          margin: { l: 0, r: 0, b: 0, t: 0 },
          scene: {
            camera: {
              eye: { x: 1.5, y: 1.5, z: 1 },
            },
            xaxis: { title: "X" },
            yaxis: { title: "Y" },
            zaxis: { title: "Vazão" },
          },
        }

        window.Plotly.newPlot(containerRef.current, data, layout, { responsive: true })
      }
    }

    // Se o Plotly já estiver carregado, inicializa o gráfico
    if (typeof window.Plotly !== "undefined") {
      initPlot()
    } else {
      // Caso contrário, define um callback para quando o script for carregado
      window.initPlot = initPlot
    }

    return () => {
      // Limpa o gráfico quando o componente for desmontado
      if (containerRef.current && typeof window.Plotly !== "undefined") {
        window.Plotly.purge(containerRef.current)
      }
    }
  }, [])

  return (
    <>
      <Script
        src="https://cdn.plot.ly/plotly-2.24.1.min.js"
        onLoad={() => {
          if (typeof window.initPlot === "function") {
            window.initPlot()
          }
        }}
      />
      <div ref={containerRef} className="w-full h-64 bg-white rounded-md border border-gray-200"></div>
    </>
  )
}

// Adiciona a definição do tipo Plotly ao objeto window
declare global {
  interface Window {
    Plotly: any
    initPlot?: () => void
  }
}
