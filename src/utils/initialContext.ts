import { ExpressionNode, parser } from '@/utils/parser'
import { tagRegex } from '@/utils/regex'
import { evalExpression } from '@/utils/evalExpression'
import type { DaisyConfig } from '@/types'

export function assignInitialVars (initialSource: string, config: DaisyConfig, currentVariant: string | undefined) {
  let currentSource = initialSource
  const vars: { template: Record<string, any>, user: DaisyConfig['variables'], metadata: Record<string, any> } = { template: {}, user: {}, metadata: {} }

  // 1. Asignar variables del usuario
  const { variables } = config
  vars.user = variables || {}

  // Definir los tipos de tags y sus mapeos correspondientes
  const tags = ['variables', 'metadata']
  type TagType = typeof tags[number]
  const tagToVarMap: Record<TagType, keyof typeof vars> = {
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
          vars[tagToVarMap[tag]] = expressionResolved
        }
      }
      // Eliminar el tag procesado del source
      currentSource = currentSource.replace(regex, '')
    }
  })

  return { cleanSource: currentSource, cleanVariables: vars }
}
