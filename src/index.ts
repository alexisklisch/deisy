import { evalExpression } from '@/utils/evalExpression'

// Ejemplo básico con la nueva API Variant.assign
console.log('=== Ejemplo con Variant.assign ===')
const colorExpression = 'Variant.assign({ primary: "blue", secondary: "red" }, "gray")'
console.log('Variante primary:', evalExpression({
  expression: colorExpression,
  currentVariant: 'primary'
})) // "blue"

console.log('Variante secondary:', evalExpression({
  expression: colorExpression,
  currentVariant: 'secondary'
})) // "red"

console.log('Sin variante:', evalExpression({
  expression: colorExpression
})) // "gray"

// Ejemplo con Variant.is
console.log('\n=== Ejemplo con Variant.is ===')
const showElementExpression = 'Variant.is("mobile")'
console.log('Es mobile:', evalExpression({
  expression: showElementExpression,
  currentVariant: 'mobile'
})) // true

console.log('Es desktop:', evalExpression({
  expression: showElementExpression,
  currentVariant: 'desktop'
})) // false

// Ejemplo con Variant.values
console.log('\n=== Ejemplo con Variant.values ===')
const stylesExpression = `Variant.values({
  mobile: { fontSize: 14, padding: 8 },
  desktop: { fontSize: 16, padding: 12 }
}, { fontSize: 12, padding: 4 })`

console.log('Estilos mobile:', evalExpression({
  expression: stylesExpression,
  currentVariant: 'mobile'
}))

console.log('Estilos desktop:', evalExpression({
  expression: stylesExpression,
  currentVariant: 'desktop'
}))

console.log('Estilos por defecto:', evalExpression({
  expression: stylesExpression
}))

// Ejemplo con Variant.isAny (nueva función)
console.log('\n=== Ejemplo con Variant.isAny ===')
const isMobileOrTabletExpression = 'Variant.isAny(["mobile", "tablet"])'
console.log('Es mobile:', evalExpression({
  expression: isMobileOrTabletExpression,
  currentVariant: 'mobile'
})) // true

console.log('Es tablet:', evalExpression({
  expression: isMobileOrTabletExpression,
  currentVariant: 'tablet'
})) // true

console.log('Es desktop:', evalExpression({
  expression: isMobileOrTabletExpression,
  currentVariant: 'desktop'
})) // false

// Ejemplo con Variant.current
console.log('\n=== Ejemplo con Variant.current ===')
const currentVariantExpression = 'Variant.current("default")'
console.log('Variante actual (mobile):', evalExpression({
  expression: currentVariantExpression,
  currentVariant: 'mobile'
}))

console.log('Variante actual (sin variante):', evalExpression({
  expression: currentVariantExpression
}))

// Ejemplo combinando con variables
console.log('\n=== Ejemplo combinando con variables ===')
const complexExpression = `userName ? Variant.assign({
  formal: "Estimado " + userName,
  casual: "Hola " + userName + "!",
  brief: userName
}, "Usuario") : "Usuario"`

console.log('Formal:', evalExpression({
  expression: complexExpression,
  variables: { userName: 'Juan' },
  currentVariant: 'formal'
}))

console.log('Casual:', evalExpression({
  expression: complexExpression,
  variables: { userName: 'Juan' },
  currentVariant: 'casual'
}))

console.log('Sin usuario:', evalExpression({
  expression: complexExpression,
  variables: { userName: null },
  currentVariant: 'formal'
}))

// Demostrar compatibilidad hacia atrás
console.log('\n=== Compatibilidad hacia atrás ===')
const oldApiExpression = 'withVariant({ old: "funciona", new: "también" }, "por defecto")'
console.log('API antigua funciona:', evalExpression({
  expression: oldApiExpression,
  currentVariant: 'old'
}))
