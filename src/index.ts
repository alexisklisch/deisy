import { getVariants, removeComments } from '@/utils/fromText'
import { assignInitialVars } from './utils/initialContext'
import type {
  DaisyConfig,
  ExportOptions,
  VariablesContext,
  Variant
} from '@/types'
import { parser } from './utils/parser'
import { recursiveVariant } from './funct/recursiveVariant'

class Daisy {
  #currentSrc: string = ''
  #variants: Variant[] = []
  #context: VariablesContext = { template: {}, user: {}, metadata: {} }

  constructor (private readonly dsySrc: string, private readonly config: DaisyConfig) {
    this.#currentSrc = removeComments(dsySrc) // Remove comments
    this.#variants = getVariants(this.#currentSrc) // Extract variants

    const { cleanSource, cleanVariables } = assignInitialVars(this.#currentSrc, this.config, this.#variants?.[0])
    this.#context = cleanVariables
    this.#currentSrc = cleanSource
  }

  export (options: ExportOptions) {
    const format = options.format || 'xml'
    const currentVariant = this.#variants[0]
    const selectedVariants: Variant[] = []

    // Determinar las variantes a procesar
    if (options.variant === undefined) {
      // Por defecto, usa la primera variante
      selectedVariants.push(this.#variants[0])
    } else if (typeof options.variant === 'string') {
      // Si no existe, devuelve error
      if (!this.#variants.includes(options.variant)) {
        throw new Error(`Variante ${options.variant} no encontrada`)
      }
      // Una sola variante
      selectedVariants.push(options.variant)
    } else {
      // Array de variantes
      const variants = options.variant as string[]
      for (const variant of variants) {
        if (!this.#variants.includes(variant)) {
          throw new Error(`Variante ${variant} no encontrada`)
        }
        selectedVariants.push(variant)
      }
    }

    // Procesar cada variante
    const results = selectedVariants.map(variant => {
      const [sourceParsed] = parser.parse(this.#currentSrc)
      recursiveVariant({
        currentNode: sourceParsed,
        parentNode: undefined,
        currentNodeIndex: undefined,
        variablesContext: this.#context,
        currentVariant
      })

      return format === 'json' ? sourceParsed : parser.build([sourceParsed])
    })

    // Si solo hay una variante, devuelve el resultado directamente
    return selectedVariants.length === 1 ? results[0] : results
  }
}

export default Daisy
