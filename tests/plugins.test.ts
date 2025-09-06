import { describe, it, expect } from 'vitest'
import Deisy, { type Plugin } from '@/index'

describe('plugins', () => {
  it('should be able to use plugins', () => {

    function plugin(): Plugin {
        return {
            nameId: 'Cosinha',
            onNode: (node) => {
                return node
             }
        }
    }

    // Arrow function

    const plugin2 = (): Plugin => ({
        nameId: 'Cosinha2',
        onNode: (node) => {
            return node
        }
    })

    const deisy = new Deisy('<div>Hello</div>', {
        plugins: [plugin()],
        variables: {}
    })
    expect(deisy.export()).toBe('<div>Hello</div>')
  })
})