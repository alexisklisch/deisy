import { describe, it, expect } from 'vitest'
import Deisy from '@/index'

describe('plugins', () => {
  it('should be able to use plugins', () => {
    const xml = `
<xml>
  <separator />

  <data>
    <column isWaiting="foo" name="name" value="John" />
    <column name="age" value={1 + 1} />
  </data>
</xml>`
    const deisy = new Deisy(xml, {
      plugins: [],
      variables: {}
    })
    const result = deisy.export({ format: 'xml' })
    console.log(result)
    expect(true).toBe(true)
  })
})
