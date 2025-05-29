import type { Variant, VariablesContext } from '@/deisyTypes'
import type { Node, parser } from '@/utils/parser'

export interface OnNodePluginUtils {
  variablesContext: VariablesContext
  currentVariant: Variant,
  variants: Variant[],
  parser: typeof parser
}

export interface Plugin {
  nameId: string
  onNode: (node: Node, utils: OnNodePluginUtils) => Node | undefined | null
}
