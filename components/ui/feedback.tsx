import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle } from "lucide-react"

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  const [state, setState] = useState<ErrorBoundaryState>({
    hasError: false,
    error: null,
  })

  const resetError = () => {
    setState({ hasError: false, error: null })
  }

  // Simular erro boundary com try/catch para componentes funcionais
  if (state.hasError) {
    return (
      fallback || (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Ops! Algo deu errado
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Ocorreu um erro inesperado. Tente recarregar a página.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={resetError}>
              Tentar novamente
            </Button>
            <Button onClick={() => window.location.reload()}>
              Recarregar página
            </Button>
          </div>
        </div>
      )
    )
  }

  return <>{children}</>
}

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  text?: string
}

export function LoadingSpinner({ size = "md", text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`animate-spin rounded-full border-b-2 border-teal-600 ${sizeClasses[size]}`} />
      {text && (
        <p className="text-gray-600 mt-4 text-center">{text}</p>
      )}
    </div>
  )
}

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      {icon && (
        <div className="mb-4 text-gray-400">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-gray-600 mb-6 max-w-sm">
          {description}
        </p>
      )}
      {action && (
        <Button 
          onClick={action.onClick}
          className="bg-teal-600 hover:bg-teal-700"
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}

interface SuccessMessageProps {
  title: string
  description?: string
  onClose?: () => void
}

export function SuccessMessage({ title, description, onClose }: SuccessMessageProps) {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {title}
        </h2>
        {description && (
          <p className="text-gray-600 mb-6">
            {description}
          </p>
        )}
        {onClose && (
          <Button onClick={onClose} className="bg-teal-600 hover:bg-teal-700">
            Continuar
          </Button>
        )}
      </div>
    </div>
  )
}
