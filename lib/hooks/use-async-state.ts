import { useState, useCallback } from "react"
import toast from "react-hot-toast"

interface AsyncState<T> {
  data: T | null
  isLoading: boolean
  error: Error | null
}

interface UseAsyncStateOptions {
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
  showSuccessToast?: boolean
  showErrorToast?: boolean
  successMessage?: string
  errorMessage?: string
}

export function useAsyncState<T>(
  initialData: T | null = null,
  options: UseAsyncStateOptions = {}
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: initialData,
    isLoading: false,
    error: null,
  })

  const {
    onSuccess,
    onError,
    showSuccessToast = false,
    showErrorToast = true,
    successMessage = "Operação realizada com sucesso!",
    errorMessage = "Erro ao realizar operação",
  } = options

  const execute = useCallback(
    async (asyncOperation: () => Promise<T>) => {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      try {
        const result = await asyncOperation()
        setState({ data: result, isLoading: false, error: null })
        
        if (showSuccessToast) {
          toast.success(successMessage)
        }
        
        onSuccess?.(result)
        return result
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error("Erro desconhecido")
        setState(prev => ({ ...prev, isLoading: false, error: errorObj }))
        
        if (showErrorToast) {
          toast.error(errorMessage)
        }
        
        onError?.(errorObj)
        throw errorObj
      }
    },
    [onSuccess, onError, showSuccessToast, showErrorToast, successMessage, errorMessage]
  )

  const reset = useCallback(() => {
    setState({ data: initialData, isLoading: false, error: null })
  }, [initialData])

  const setData = useCallback((data: T) => {
    setState(prev => ({ ...prev, data }))
  }, [])

  return {
    ...state,
    execute,
    reset,
    setData,
  }
}

interface UseFormStateOptions {
  resetOnSuccess?: boolean
  showSuccessToast?: boolean
  successMessage?: string
}

export function useFormState<T extends Record<string, any>>(
  initialValues: T,
  options: UseFormStateOptions = {}
) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})

  const {
    resetOnSuccess = true,
    showSuccessToast = true,
    successMessage = "Formulário enviado com sucesso!",
  } = options

  const asyncState = useAsyncState(null, {
    showSuccessToast,
    successMessage,
    onSuccess: () => {
      if (resetOnSuccess) {
        reset()
      }
    },
  })

  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }))
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }, [errors])

  const setFieldTouched = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }, [])

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }))
  }, [])

  const validateField = useCallback((
    field: keyof T, 
    validator: (value: any) => string | null
  ) => {
    const error = validator(values[field])
    if (error) {
      setFieldError(field, error)
      return false
    }
    return true
  }, [values, setFieldError])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    asyncState.reset()
  }, [initialValues, asyncState])

  const handleSubmit = useCallback(
    async (submitFn: (values: T) => Promise<any>) => {
      // Marcar todos os campos como touched
      const allTouched = Object.keys(values).reduce((acc, key) => {
        acc[key as keyof T] = true
        return acc
      }, {} as Partial<Record<keyof T, boolean>>)
      setTouched(allTouched)

      // Verificar se há erros
      const hasErrors = Object.values(errors).some(error => error != null)
      if (hasErrors) {
        throw new Error("Corrija os erros antes de enviar")
      }

      return asyncState.execute(() => submitFn(values))
    },
    [values, errors, asyncState]
  )

  return {
    values,
    errors,
    touched,
    isLoading: asyncState.isLoading,
    error: asyncState.error,
    setValue,
    setFieldTouched,
    setFieldError,
    validateField,
    handleSubmit,
    reset,
  }
}
