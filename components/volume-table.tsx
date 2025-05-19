"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface VolumeData {
  position: string
  volume: string
  tempo: string
  vazao: string
}

export function VolumeTable() {
  const [data, setData] = useState<VolumeData[]>([
    { position: "1°", volume: "580", tempo: "29,33", vazao: "x" },
    { position: "2°", volume: "insert", tempo: "insert", vazao: "" },
    { position: "3°", volume: "insert", tempo: "insert", vazao: "" },
  ])

  const [mediaVazao, setMediaVazao] = useState("00,00")

  const handleChange = (index: number, field: keyof VolumeData, value: string) => {
    const newData = [...data]
    newData[index][field] = value
    setData(newData)
  }

  return (
    <div className="mt-6 relative p-4 border border-gray-200 rounded-lg">
      <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-teal-600">
        <X className="h-5 w-5" />
      </Button>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-300 px-2 py-1 text-sm">Rep.</th>
              <th className="border border-gray-300 px-2 py-1 text-sm">Volume</th>
              <th className="border border-gray-300 px-2 py-1 text-sm">tempo</th>
              <th className="border border-gray-300 px-2 py-1 text-sm">Vaz(l/h)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-2 py-1 text-center">{row.position}</td>
                <td className="border border-gray-300 px-2 py-1">
                  <Input
                    value={row.volume}
                    onChange={(e) => handleChange(index, "volume", e.target.value)}
                    className="h-8 text-sm"
                  />
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  <Input
                    value={row.tempo}
                    onChange={(e) => handleChange(index, "tempo", e.target.value)}
                    className="h-8 text-sm"
                  />
                </td>
                <td className="border border-gray-300 px-2 py-1 text-center">{row.vazao}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <p className="text-sm">média vazão: {mediaVazao}</p>
        <Button className="bg-teal-600 hover:bg-teal-700 text-white">Salvar</Button>
      </div>
    </div>
  )
}
