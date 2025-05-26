import { describe, it, expect } from 'vitest'
import Daisy from '../src'

describe('Daisy: exists', () => {
  it('should be defined', () => {
    expect(Daisy).toBeDefined()
  })

  it('should have a constructor', () => {
    expect(Daisy.prototype.constructor).toBeDefined()
  })
})

describe('Daisy: basic', () => {
  const xml1 = `
<xml>
  <dsy-variants content={["default", "mobile"]}/>
  <dsy-variables content={1 + 1}/>
  <separator />

  <data>
    <column name="name" value="John" />
    <column name="age" value={1 + 1} />
  </data>
</xml>`

  it('should be defined', () => {
    const dsy = new Daisy(xml1, { variables: {} })
    const exported = dsy.export({ format: 'json', variant: 'default' })
    console.log(JSON.stringify(exported, null, 2))
    expect(dsy).toBeDefined()
  })
})
