import { getVariants, removeComments } from '@/utils/fromText'
import { assignInitialVars } from '@/utils/initialContext'
import { parser } from '@/utils/parser'
import { tagRegex } from '@/utils/regex'
import { recursiveVariant } from '@/funct/recursiveVariant'
import type {
  DeisyConfig,
  ExportOptions,
  VariablesContext,
  Variant
} from '@/types'

class Deisy {
  #currentSrc: string = ''
  #variants: Variant[] = []
  #context: VariablesContext = { template: {}, user: {}, metadata: {} }

  constructor (private readonly dsySrc: string, private readonly config: DeisyConfig = { variables: {} }) {
    this.#currentSrc = removeComments(dsySrc) // Remove comments
    this.#variants = getVariants(this.#currentSrc) // Extract variants
    // Remove variants tag
    this.#currentSrc = this.#currentSrc.replace(tagRegex('dsy-variants'), '')

    const { cleanSource, cleanVariables } = assignInitialVars(this.#currentSrc, config, this.#variants?.[0])
    this.#context = cleanVariables
    this.#currentSrc = cleanSource
  }

  export (options: ExportOptions = { format: 'xml', variants: undefined }) {
    const format = options.format
    const selectedVariants: Variant[] = []

    // Determine the variants to process
    if (options.variants === undefined) {
      // By default, use the first variant
      selectedVariants.push(this.#variants[0])
    } else if (typeof options.variants === 'string') {
      // If it doesn't exist, return an error
      if (!this.#variants.includes(options.variants)) {
        throw new Error(`Variante ${options.variants} no encontrada`)
      }
      // Only one variant
      selectedVariants.push(options.variants)
    } else {
      // Array of variants
      const variants = options.variants
      for (const variant of variants) {
        if (!this.#variants.includes(variant)) {
          throw new Error(`Variante ${variant} no encontrada`)
        }
        selectedVariants.push(variant)
      }
    }

    // Process each variant
    const results = selectedVariants.map(variant => {
      const [sourceParsed] = parser.parse(this.#currentSrc)
      recursiveVariant({
        currentNode: sourceParsed,
        parentNode: undefined,
        currentNodeIndex: undefined,
        variablesContext: this.#context,
        currentVariant: variant
      })

      return format === 'json' ? sourceParsed : parser.build([sourceParsed])
    })

    // If there is only one variant, return the result directly
    return selectedVariants.length === 1 ? results[0] : results
  }
}

export default Deisy
