import { describe, it, expect } from 'vitest'
import Daisy from '../src/index'

describe('context: user', () => {
  it('should return the correct value', () => {
    const daisy = new Daisy('<d></d>', {
      variables: {
        user: {
          name: 'Pedro'
        }
      }
    })

    expect(daisy.config.variables.user.name).toBe('Pedro')
  })
})
