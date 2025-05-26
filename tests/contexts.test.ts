import { describe, it, expect } from 'vitest'
import Deisy from '../src/index'

describe('context: user', () => {
  it('should return the correct value', () => {
    const deisy = new Deisy('<d></d>', {
      variables: {
        user: {
          name: 'Pedro'
        }
      }
    })

    expect(deisy.config.variables.user.name).toBe('Pedro')
  })
})
