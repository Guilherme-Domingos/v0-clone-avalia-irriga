import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

// Schema de validação
const propriedadeSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").min(3, "Nome deve ter pelo menos 3 caracteres"),
  endereco: z.string().min(1, "Endereço é obrigatório"),
  area: z.string().min(1, "Área é obrigatória"),
  observacoes: z.string().optional(),
})

type PropriedadeFormData = z.infer<typeof propriedadeSchema>

interface PropriedadeFormProps {
  initialData?: Partial<PropriedadeFormData>
  onSubmit: (data: PropriedadeFormData) => Promise<void>
  onCancel: () => void
  submitLabel?: string
  isLoading?: boolean
}

export function PropriedadeForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  submitLabel = "Salvar",
  isLoading = false 
}: PropriedadeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PropriedadeFormData>({
    resolver: zodResolver(propriedadeSchema),
    defaultValues: initialData,
  })

  const handleFormSubmit = async (data: PropriedadeFormData) => {
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
          <Label htmlFor="nome">Nome da Propriedade *</Label>
          <Input
            id="nome"
            {...register("nome")}
            placeholder="Ex: Fazenda São José"
            disabled={isProcessing}
          />
          {errors.nome && (
            <p className="text-sm text-red-500">{errors.nome.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endereco">Endereço *</Label>
          <Input
            id="endereco"
            {...register("endereco")}
            placeholder="Ex: Rua das Flores, 123 - Centro"
            disabled={isProcessing}
          />
          {errors.endereco && (
            <p className="text-sm text-red-500">{errors.endereco.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="area">Área (hectares) *</Label>
          <Input
            id="area"
            {...register("area")}
            placeholder="Ex: 50"
            type="number"
            step="0.01"
            disabled={isProcessing}
          />
          {errors.area && (
            <p className="text-sm text-red-500">{errors.area.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="observacoes">Observações</Label>
          <Textarea
            id="observacoes"
            {...register("observacoes")}
            placeholder="Observações adicionais sobre a propriedade..."
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
