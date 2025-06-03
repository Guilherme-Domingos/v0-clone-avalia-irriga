import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

// Schema de validação
const unidadeSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").min(3, "Nome deve ter pelo menos 3 caracteres"),
  tipo: z.enum(["setor-hidraulico", "pivo-central"], {
    required_error: "Tipo é obrigatório",
  }),
  area: z.string().min(1, "Área é obrigatória"),
  cultura: z.string().min(1, "Cultura é obrigatória"),
  observacoes: z.string().optional(),
})

type UnidadeFormData = z.infer<typeof unidadeSchema>

interface UnidadeFormProps {
  initialData?: Partial<UnidadeFormData>
  onSubmit: (data: UnidadeFormData) => Promise<void>
  onCancel: () => void
  submitLabel?: string
  isLoading?: boolean
  showTypeSelection?: boolean
}

export function UnidadeForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  submitLabel = "Salvar",
  isLoading = false,
  showTypeSelection = true
}: UnidadeFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UnidadeFormData>({
    resolver: zodResolver(unidadeSchema),
    defaultValues: initialData,
  })

  const tipo = watch("tipo")

  const handleFormSubmit = async (data: UnidadeFormData) => {
    try {
      await onSubmit(data)
    } catch (error) {
      // Erro já tratado no componente pai
    }
  }

  const isProcessing = isSubmitting || isLoading

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome da Unidade *</Label>
          <Input
            id="nome"
            {...register("nome")}
            placeholder="Ex: Setor Hidráulico 1 - Tomates"
            disabled={isProcessing}
          />
          {errors.nome && (
            <p className="text-sm text-red-500">{errors.nome.message}</p>
          )}
        </div>

        {showTypeSelection && (
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Irrigação *</Label>
            <Select
              value={tipo}
              onValueChange={(value) => setValue("tipo", value as "setor-hidraulico" | "pivo-central")}
              disabled={isProcessing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de irrigação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="setor-hidraulico">Setor Hidráulico</SelectItem>
                <SelectItem value="pivo-central">Pivô Central</SelectItem>
              </SelectContent>
            </Select>
            {errors.tipo && (
              <p className="text-sm text-red-500">{errors.tipo.message}</p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="area">Área (hectares) *</Label>
          <Input
            id="area"
            {...register("area")}
            placeholder="Ex: 15"
            type="number"
            step="0.01"
            disabled={isProcessing}
          />
          {errors.area && (
            <p className="text-sm text-red-500">{errors.area.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cultura">Cultura *</Label>
          <Input
            id="cultura"
            {...register("cultura")}
            placeholder="Ex: Tomate, Milho, Soja"
            disabled={isProcessing}
          />
          {errors.cultura && (
            <p className="text-sm text-red-500">{errors.cultura.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="observacoes">Observações</Label>
          <Textarea
            id="observacoes"
            {...register("observacoes")}
            placeholder="Observações adicionais sobre a unidade..."
            disabled={isProcessing}
            rows={3}
          />
          {errors.observacoes && (
            <p className="text-sm text-red-500">{errors.observacoes.message}</p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isProcessing}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isProcessing}
            className="flex-1 bg-teal-600 hover:bg-teal-700"
          >
            {isProcessing ? "Salvando..." : submitLabel}
          </Button>
        </div>
      </form>
    </Card>
  )
}
