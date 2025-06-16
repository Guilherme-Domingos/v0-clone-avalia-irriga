"use client"

import { useEffect, useRef, useState } from "react"
import Script from "next/script"
import { Button } from "@/components/ui/button"
import { RotateCcw, Move, ZoomIn, ZoomOut } from "lucide-react"

interface Mapa3DInterativoProps {
  dados?: number[][]
  titulo?: string
}

export function Mapa3DInterativo({ dados, titulo = "Distribuição de Vazão" }: Mapa3DInterativoProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const plotRef = useRef<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const initPlot = () => {
      if (typeof window.Plotly !== "undefined" && containerRef.current) {
        const gridSize = 10
        const x = Array.from({ length: gridSize }, (_, i) => i)
        const y = Array.from({ length: gridSize }, (_, i) => i)

        // Usar dados fornecidos ou gerar dados simulados
        const z =
          dados ||
          Array.from({ length: gridSize }, (_, i) =>
            Array.from({ length: gridSize }, (_, j) => {
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
            hovertemplate: "X: %{x}<br>Y: %{y}<br>Vazão: %{z:.2f}<extra></extra>",
          },
        ]

        const layout = {
          title: {
            text: titulo,
            font: { size: 16 },
          },
          autosize: true,
          margin: { l: 0, r: 0, b: 0, t: 40 },
          scene: {
            camera: {
              eye: { x: 1.5, y: 1.5, z: 1 },
            },
            xaxis: {
              title: "X (m)",
              showgrid: true,
              gridcolor: "rgba(0,0,0,0.1)",
            },
            yaxis: {
              title: "Y (m)",
              showgrid: true,
              gridcolor: "rgba(0,0,0,0.1)",
            },
            zaxis: {
              title: "Vazão (L/h)",
              showgrid: true,
              gridcolor: "rgba(0,0,0,0.1)",
            },
            dragmode: "orbit",
          },
          paper_bgcolor: "rgba(0,0,0,0)",
          plot_bgcolor: "rgba(0,0,0,0)",
        }

        const config = {
          responsive: true,
          displayModeBar: true,
          modeBarButtonsToRemove: ["pan2d", "select2d", "lasso2d", "autoScale2d"],
          modeBarButtonsToAdd: [
            {
              name: "Resetar Vista",
              icon: {
                width: 857.1,
                height: 1000,
                path: "M857.1 428.6c0-204.8-166.3-371.4-371.4-371.4S114.3 223.8 114.3 428.6c0 204.8 166.3 371.4 371.4 371.4S857.1 633.4 857.1 428.6zM428.6 742.9c-173.4 0-314.3-140.9-314.3-314.3S255.2 114.3 428.6 114.3 742.9 255.2 742.9 428.6 602 742.9 428.6 742.9z",
              },
              click: () => resetView(),
            },
          ],
        }

        plotRef.current = window.Plotly.newPlot(containerRef.current, data, layout, config)
        setIsLoaded(true)
      }
    }

    if (typeof window.Plotly !== "undefined") {
      initPlot()
    } else {
      window.initPlot = initPlot
    }

    return () => {
      if (containerRef.current && typeof window.Plotly !== "undefined") {
        window.Plotly.purge(containerRef.current)
      }
    }
  }, [dados, titulo])

  const resetView = () => {
    if (plotRef.current && containerRef.current) {
      const update = {
        "scene.camera": {
          eye: { x: 1.5, y: 1.5, z: 1 },
          center: { x: 0, y: 0, z: 0 },
          up: { x: 0, y: 0, z: 1 },
        },
      }
      window.Plotly.relayout(containerRef.current, update)
    }
  }

  const zoomIn = () => {
    if (plotRef.current && containerRef.current) {
      const update = {
        "scene.camera.eye": { x: 1.2, y: 1.2, z: 0.8 },
      }
      window.Plotly.relayout(containerRef.current, update)
    }
  }

  const zoomOut = () => {
    if (plotRef.current && containerRef.current) {
      const update = {
        "scene.camera.eye": { x: 2, y: 2, z: 1.5 },
      }
      window.Plotly.relayout(containerRef.current, update)
    }
  }

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

      <div className="relative">
        {/* Controles do gráfico */}
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-1 bg-white/90 backdrop-blur-sm rounded-lg p-1 shadow-lg">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={resetView} title="Resetar vista">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={zoomIn} title="Zoom in">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={zoomOut} title="Zoom out">
            <ZoomOut className="h-4 w-4" />
          </Button>
        </div>

        {/* Instruções de uso */}
        <div className="absolute bottom-2 left-2 z-10 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-xs text-gray-600 max-w-48">
          <div className="flex items-center gap-1 mb-1">
            <Move className="h-3 w-3" />
            <span>Arraste para rotacionar</span>
          </div>
          <div>Scroll para zoom</div>
        </div>

        <div ref={containerRef} className="w-full h-64 md:h-96 bg-white rounded-md border border-gray-200 relative">
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

declare global {
  interface Window {
    Plotly: any
    initPlot?: () => void
  }
}
