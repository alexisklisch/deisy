import { evalExpression } from '@/utils/evalExpression'

// Ejemplo básico con withVariant
console.log('=== Ejemplo con withVariant ===')
const colorExpression = 'withVariant({ primary: "blue", secondary: "red" }, "gray")'
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

// Ejemplo con isVariant
console.log('\n=== Ejemplo con isVariant ===')
const showElementExpression = 'isVariant("mobile")'
console.log('Es mobile:', evalExpression({
  expression: showElementExpression,
  currentVariant: 'mobile'
})) // true

console.log('Es desktop:', evalExpression({
  expression: showElementExpression,
  currentVariant: 'desktop'
})) // false

// Ejemplo con variantValues
console.log('\n=== Ejemplo con variantValues ===')
const stylesExpression = `variantValues({
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

// Ejemplo combinando con variables
console.log('\n=== Ejemplo combinando con variables ===')
const complexExpression = `userName ? withVariant({
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
