interface CoeficienteScaleProps {
  value: number // 0-100
}

export function CoeficienteScale({ value }: CoeficienteScaleProps) {
  // Determina a classificação baseada no valor
  let classification = ""
  let color = ""

  if (value < 70) {
    classification = "RUIM"
    color = "bg-red-500"
  } else if (value < 80) {
    classification = "REGULAR"
    color = "bg-yellow-500"
  } else if (value < 90) {
    classification = "BOM"
    color = "bg-green-500"
  } else {
    classification = "EXCELENTE"
    color = "bg-blue-500"
  }

  return (
    <div className="w-full">
      <div className="relative h-8 bg-gray-200 rounded-md overflow-hidden">
        <div className="absolute flex w-full h-full">
          <div className="h-full bg-red-500 flex-1"></div>
          <div className="h-full bg-yellow-500 flex-1"></div>
          <div className="h-full bg-green-500 flex-1"></div>
          <div className="h-full bg-blue-500 flex-1"></div>
        </div>

        <div className="absolute top-0 left-0 w-full flex justify-between px-2 text-xs text-white font-medium pt-1.5">
          <span>RUIM</span>
          <span>REGULAR</span>
          <span>BOM</span>
          <span>EXCELENTE</span>
        </div>

        {/* Marcador da posição atual */}
        <div
          className="absolute top-0 h-full w-1 bg-black"
          style={{ left: `${value}%`, transform: "translateX(-50%)" }}
        ></div>
      </div>
    </div>
  )
}
