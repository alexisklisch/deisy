import { evalExpression } from '@/utils/evalExpression'
import { tagRegex } from '@/utils/regex'
import { parser, type ExpressionNode } from '@/utils/parser'
import type { Variant } from '@/types'

export const removeComments = (text: string) => {
  return text.replace(/\/\*[\s\S]*?\*\//g, '')
}

export const getVariants = (source: string): Variant[] => {
  const variantsElementRegex = tagRegex('dsy-variants')
  const variantsElementRaw = source.match(variantsElementRegex)?.[0]

  if (!variantsElementRaw) return [undefined]

  const [variants] = parser.parse(variantsElementRaw)
  if (variants.type !== 'tag') return [undefined]

  const nodeExpression = variants.attr.content as ExpressionNode
  const expressionResolved = evalExpression({
    expression: nodeExpression.content,
    currentVariant: 'default'
  })

  if (!Array.isArray(expressionResolved)) return [undefined]

  return expressionResolved.every(variation => typeof variation === 'string')
    ? expressionResolved
    : [undefined]
}
