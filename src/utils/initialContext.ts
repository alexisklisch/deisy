import { ExpressionNode, parser } from '@/utils/parser'
import { tagRegex } from '@/utils/regex'
import { evalExpression } from '@/utils/evalExpression'
import type { DeisyConfig, VariablesContext } from '@/types'

export function assignInitialVars (initialSource: string, config: DeisyConfig, currentVariant: string | undefined) {
  let currentSource = initialSource
  const newContext: VariablesContext = { template: {}, user: {}, metadata: {} }

  // 1. Asignar variables del usuario
  const { variables } = config
  newContext.user = variables || {}

  // Definir los tipos de tags y sus mapeos correspondientes
  const tags = ['variables', 'metadata']
  type TagType = typeof tags[number]
  const tagToVarMap: Record<TagType, keyof typeof newContext> = {
    variables: 'template',
    metadata: 'metadata'
  }

  // Procesar cada tipo de tag
  tags.forEach(tag => {
    const regex = tagRegex(`dsy-${tag}`)
    const match = currentSource.match(regex)

    if (match) {
      const [parsed] = parser.parse(match[0] || '')
      if (parsed.type === 'tag') {
        const expression = parsed.attr.content as ExpressionNode
        if (expression.content) {
          const expressionResolved = evalExpression({ expression: expression.content, currentVariant })
          newContext[tagToVarMap[tag]] = expressionResolved
        }
      }
      // Eliminar el tag procesado del source
      currentSource = currentSource.replace(regex, '')
    }
  })

  return { cleanSource: currentSource, cleanVariables: newContext }
}
