import { getVariants, removeComments } from '@/utils/fromText'
import type { DaisyConfig } from '@/types'
import { assignInitialVars } from './utils/initialContext'

class Daisy {
  #currentSrc: string = ''
  #variants: string[] | undefined = []

  constructor (private readonly dsySrc: string, private readonly config: DaisyConfig) {
    this.#currentSrc = removeComments(dsySrc) // Remove comments
    this.#variants = getVariants(this.#currentSrc) // Extract variants

    const { cleanSource, cleanVariables } = assignInitialVars(this.#currentSrc, this.config, this.#variants?.[0])

    console.log(cleanSource)
    console.log(cleanVariables)
  }
}

export default Daisy
