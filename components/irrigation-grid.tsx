"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

type PointStatus = "empty" | "selected" | "filled"

export function IrrigationGrid() {
  // Grid de 4x4 para os pontos de coleta conforme metodologia Keller e Karmelli
  const [points, setPoints] = useState<PointStatus[][]>([
    ["empty", "empty", "empty", "empty"],
    ["empty", "empty", "empty", "empty"],
    ["empty", "selected", "selected", "selected"],
    ["selected", "selected", "selected", "selected"],
  ])

  const handlePointClick = (row: number, col: number) => {
    const newPoints = [...points]

    // Ciclo entre os estados: empty -> selected -> filled -> empty
    if (newPoints[row][col] === "empty") {
      newPoints[row][col] = "selected"
    } else if (newPoints[row][col] === "selected") {
      newPoints[row][col] = "filled"
    } else {
      newPoints[row][col] = "empty"
    }

    setPoints(newPoints)
  }

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-5 gap-2 mb-4">
        <div className="col-start-2 text-center text-sm">1°</div>
        <div className="text-center text-sm">1/3</div>
        <div className="text-center text-sm">2/3</div>
        <div className="text-center text-sm">Últ.</div>

        <div className="text-center text-sm">1°</div>
        {points[0].map((status, colIndex) => (
          <Button
            key={`0-${colIndex}`}
            variant="outline"
            className={`w-12 h-12 p-0 rounded-full ${
              status === "empty" ? "bg-gray-200" : status === "selected" ? "bg-teal-500" : "bg-teal-700"
            }`}
            onClick={() => handlePointClick(0, colIndex)}
          />
        ))}

        <div className="text-center text-sm">1/3</div>
        {points[1].map((status, colIndex) => (
          <Button
            key={`1-${colIndex}`}
            variant="outline"
            className={`w-12 h-12 p-0 rounded-full ${
              status === "empty" ? "bg-gray-200" : status === "selected" ? "bg-teal-500" : "bg-teal-700"
            }`}
            onClick={() => handlePointClick(1, colIndex)}
          />
        ))}

        <div className="text-center text-sm">2/3</div>
        {points[2].map((status, colIndex) => (
          <Button
            key={`2-${colIndex}`}
            variant="outline"
            className={`w-12 h-12 p-0 rounded-full ${
              status === "empty" ? "bg-gray-200" : status === "selected" ? "bg-teal-500" : "bg-teal-700"
            }`}
            onClick={() => handlePointClick(2, colIndex)}
          />
        ))}

        <div className="text-center text-sm">Últ.</div>
        {points[3].map((status, colIndex) => (
          <Button
            key={`3-${colIndex}`}
            variant="outline"
            className={`w-12 h-12 p-0 rounded-full ${
              status === "empty" ? "bg-gray-200" : status === "selected" ? "bg-teal-500" : "bg-teal-700"
            }`}
            onClick={() => handlePointClick(3, colIndex)}
          />
        ))}
      </div>
    </div>
  )
}
