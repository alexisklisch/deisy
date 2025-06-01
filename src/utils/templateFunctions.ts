import { parser } from '@/utils/parser'

// Objeto Variant que agrupa todas las funciones relacionadas con variantes
export const Variant = {
  // Función principal para asignar valores basados en variante
  assign: (
    attributes: Record<string, any>,
    defaultValue?: any
  ) => {
    return (currentVariant?: string) => {
      if (!currentVariant) return defaultValue
      return attributes[currentVariant] ?? defaultValue
    }
  },

  // Verificar si una variante específica está activa
  is: (targetVariant: string) => {
    return (currentVariant?: string) => currentVariant === targetVariant
  },

  // Obtener múltiples valores basados en variante
  values: (
    variantMap: Record<string, Record<string, any>>,
    defaultValues: Record<string, any> = {}
  ) => {
    return (currentVariant?: string) => {
      if (!currentVariant) return defaultValues
      return { ...defaultValues, ...variantMap[currentVariant] }
    }
  },

  // Función para verificar si alguna de las variantes está activa
  isAny: (targetVariants: string[]) => {
    return (currentVariant?: string) =>
      currentVariant ? targetVariants.includes(currentVariant) : false
  },

  // Función para obtener la variante actual o un valor por defecto
  current: (defaultVariant: string = 'default') => {
    return (currentVariant?: string) => currentVariant || defaultVariant
  }
}

export const Parser = parser
