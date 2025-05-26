type TupleToUnion<T extends any[]> = T[number]

export type ExpressionNode = {
  type: 'expr'
  content: string
}
export type TextNode = {
  type: 'text',
  content: string
}
export type TagNode = {
  type: 'tag'
  tag: string
  attr: Record<string, string | ExpressionNode>
  child: Node[]
}

export type Node = TupleToUnion<[ExpressionNode, TextNode, TagNode]>

class XMLParser {
  private pos = 0
  constructor (private xml: string) { }

  public parse (): Node[] {
    return this.parseNodes()
  }

  private parseNodes (): Node[] {
    const nodes: Node[] = []
    while (this.pos < this.xml.length) {
      const char = this.xml[this.pos]
      if (char === '<') {
        if (this.xml.startsWith('</', this.pos)) break
        nodes.push(this.parseElement())
      } else if (char === '{') {
        // Parse expression block
        const expr = this.parseCodeBlock().trim()
        nodes.push({ type: 'expr', content: expr })
      } else {
        const text = this.readText()
        if (text.trim().length > 0) nodes.push({ type: 'text', content: text })
      }
    }
    return nodes
  }

  private parseElement (): TagNode {
    this.pos++ // Skip '<'
    const tag = this.readUntil(/[\s>/]/)
    this.skipWhitespace()
    const attr = this.parseAttributes()
    this.skipWhitespace()

    let child: Node[] = []
    if (this.xml.startsWith('/>', this.pos)) {
      this.pos += 2
    } else if (this.xml[this.pos] === '>') {
      this.pos++ // Skip '>'
      child = this.parseNodes()
      if (this.xml.startsWith('</', this.pos)) {
        this.pos += 2 // Skip '</'
        this.readUntil('>')
        this.pos++ // Skip '>'
      }
    }

    return { type: 'tag', tag, attr, child }
  }

  private parseAttributes (): Record<string, string | ExpressionNode> {
    const attrs: Record<string, string | ExpressionNode> = {}
    while (this.pos < this.xml.length) {
      this.skipWhitespace()
      if (this.xml[this.pos] === '>' || this.xml.startsWith('/>', this.pos)) break

      const attrName = this.readUntil(/[\s=]/)
      this.skipWhitespace()

      if (this.xml[this.pos] === '=') {
        this.pos++ // Skip '='
        this.skipWhitespace()
        const attrValue = this.parseAttributeValue()
        attrs[attrName] = attrValue
      } else {
        attrs[attrName] = ''
      }
    }
    return attrs
  }

  private parseAttributeValue (): string | ExpressionNode {
    const current = this.xml[this.pos]
    if (current === '"' || current === "'") {
      this.pos++ // Skip opening quote
      const value = this.readUntil(current)
      this.pos++ // Skip closing quote
      return value
    } else if (current === '`') {
      // Template literal case
      this.pos++ // Skip opening backtick
      const value = this.readUntil('`')
      this.pos++ // Skip closing backtick
      return { type: 'expr', content: `\`${value}\`` }
    } else if (current === '{') {
      const code = this.parseCodeBlock().trim()
      return { type: 'expr', content: code }
    }
    return ''
  }

  /**
   * Parse a code block delimited by '{' and '}'.
   * Manages depth to support proper nesting.
   */
  private parseCodeBlock (): string {
    this.pos++ // Skip '{'
    const start = this.pos
    let depth = 1

    while (this.pos < this.xml.length) {
      const char = this.xml[this.pos]
      if (char === '{') {
        depth++
      } else if (char === '}') {
        depth--
        if (depth === 0) {
          const code = this.xml.substring(start, this.pos)
          this.pos++ // Skip '}'
          return code
        }
      }
      this.pos++
    }

    return this.xml.substring(start, this.pos)
  }

  private readText (): string {
    const start = this.pos
    while (this.pos < this.xml.length && !['<', '{'].includes(this.xml[this.pos])) {
      this.pos++
    }
    return this.xml.substring(start, this.pos)
  }

  private readUntil (delimiter: string | RegExp): string {
    const start = this.pos
    while (this.pos < this.xml.length && !this.matches(delimiter)) {
      this.pos++
    }
    return this.xml.substring(start, this.pos)
  }

  private matches (delimiter: string | RegExp): boolean {
    if (typeof delimiter === 'string') {
      return this.xml.startsWith(delimiter, this.pos)
    }
    return delimiter.test(this.xml[this.pos])
  }

  private skipWhitespace (): void {
    while (this.pos < this.xml.length && /\s/.test(this.xml[this.pos])) {
      this.pos++
    }
  }
}

class XMLBuilder {
  constructor (private nodes: Node[]) {}

  /**
   * Builds the XML string from the parsed nodes.
   */
  public build (): string {
    return this.nodes.map((node) => this.buildNode(node)).join('')
  }

  /**
   * Process a node based on its type (tag, text, or expression).
   */
  private buildNode (node: Node): string {
    switch (node.type) {
      case 'tag':
        return this.buildTag(node)
      case 'text':
        return node.content
      case 'expr':
        return `{${node.content}}`
      default:
        return ''
    }
  }

  /**
   * Rebuilds an XML tag element.
   * If the element has no children, generates a self-closing tag.
   */
  private buildTag (node: TagNode): string {
    const tag = node.tag
    const attrs = this.buildAttributes(node.attr)
    const children = node.child.map((child) => this.buildNode(child)).join('')

    if (children.length === 0) {
      return `<${tag}${attrs}/>`
    } else {
      return `<${tag}${attrs}>${children}</${tag}>`
    }
  }

  /**
   * Rebuilds attributes without applying escapes, to preserve
   * the original format.
   */
  private buildAttributes (attrs: Record<string, string | ExpressionNode>): string {
    const keys = Object.keys(attrs)
    if (keys.length === 0) {
      return ''
    }

    return keys
      .map((key) => {
        const val = attrs[key]

        if (typeof val === 'string') {
          return ` ${key}='${val}'`
        } else if (val.type === 'expr') {
          return ` ${key}={${val.content}}`
        }
        return ''
      })
      .join('')
  }
}

export const parser = {
  parse: (xml: string) => {
    const parser = new XMLParser(xml)
    return parser.parse()
  },
  build: (node: Node[]) => {
    const builder = new XMLBuilder(node)
    return builder.build()
  }
}
