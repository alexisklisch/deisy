import { describe, it, expect } from 'vitest'
import Deisy from '../src'

describe('Deisy: exists', () => {
  it('should be defined', () => {
    expect(Deisy).toBeDefined()
  })

  it('should have a constructor', () => {
    expect(Deisy.prototype.constructor).toBeDefined()
  })
})

describe('Deisy: basic', () => {
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
    const dsy = new Deisy(xml1, { variables: {} })
    const exported = dsy.export({ format: 'json', variant: 'default' })
    console.log(JSON.stringify(exported, null, 2))
    expect(dsy).toBeDefined()
  })
})
