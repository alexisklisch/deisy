// Función para manejar variantes de forma sencilla pero poderosa
export const withVariant = (
  attributes: Record<string, any>,
  defaultValue?: any
) => {
  // Retorna una función que puede ser llamada con el currentVariant
  return (currentVariant?: string) => {
    if (!currentVariant) return defaultValue
    return attributes[currentVariant] ?? defaultValue
  }
}

// Función auxiliar para casos simples donde solo necesitas verificar si una variante está activa
export const isVariant = (targetVariant: string) => {
  return (currentVariant?: string) => currentVariant === targetVariant
}

// Función para obtener múltiples valores basados en variante
export const variantValues = (
  variantMap: Record<string, Record<string, any>>,
  defaultValues: Record<string, any> = {}
) => {
  return (currentVariant?: string) => {
    if (!currentVariant) return defaultValues
    return { ...defaultValues, ...variantMap[currentVariant] }
  }
}
