import { evalExpression } from '@/utils/evalExpression'

console.log(evalExpression({
  expression: '(function() { return globalThis })()',
  variables: {
    template: {
      name: 'Sixto Fernandez'
    }
  }
}))
