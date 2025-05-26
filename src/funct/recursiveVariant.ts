import type { VariablesContext, Variant } from '@/types'
import { evalExpression } from '@/utils/evalExpression'
import type { ExpressionNode, Node, TagNode } from '@/utils/parser'

interface RecursiveVariant {
  currentNode: Node
  parentNode?: TagNode
  currentNodeIndex?: number
  variablesContext: VariablesContext
  currentVariant: Variant
}

export const recursiveVariant = ({
  currentNode,
  parentNode,
  currentNodeIndex,
  currentVariant,
  variablesContext
}: RecursiveVariant) => {
  if (typeof currentNode === 'object') {
    if (currentNode.type === 'tag') {
      const elementAttrs: Record<string, string | ExpressionNode> = currentNode?.attr || {}

      if (elementAttrs) {
        for (const [attrName, attrValue] of Object.entries(elementAttrs)) {
          if (typeof attrValue === 'object' && attrValue.type === 'expr') {
            const result = evalExpression({ expression: attrValue.content, variables: variablesContext, currentVariant })
            currentNode.attr[attrName] = typeof result === 'object' && result !== null
              ? JSON.stringify(result)
              : String(result)
          }
        }
      }

      for (const [key, value] of Object.entries(currentNode.child)) {
        recursiveVariant({
          currentNode: value,
          parentNode: currentNode,
          currentNodeIndex: +key,
          variablesContext,
          currentVariant
        })
      }

      return
    }

    if (currentNode.type === 'expr') {
      const expressionResult = evalExpression({ expression: currentNode.content, variables: variablesContext, currentVariant })

      // Si es un primitivo o un array, convertirlo a nodo de texto
      if (typeof expressionResult !== 'object' || expressionResult === null || Array.isArray(expressionResult)) {
        parentNode!.child[currentNodeIndex!] = { type: 'text', content: String(expressionResult) }
      // Si es un objeto que ya tiene la estructura de un nodo (con la propiedad 'type')
      } else if (expressionResult && typeof expressionResult === 'object' && 'type' in expressionResult) {
        parentNode!.child[currentNodeIndex!] = expressionResult
      // Para cualquier otro objeto, convertirlo a texto
      } else {
        parentNode!.child[currentNodeIndex!] = { type: 'text', content: JSON.stringify(expressionResult) }
      }

      recursiveVariant({
        currentNode: parentNode!.child[currentNodeIndex!],
        parentNode,
        currentNodeIndex: currentNodeIndex!,
        variablesContext,
        currentVariant
      })
    }
  }
}
