// Regex to match a tag with its attributes and content
// Example: <div class="container">Hello</div>
export const tagRegex = (tag: string) => {
  return new RegExp(
    `<${tag}\\b(?:(?:"[^"]*"|'[^']*'|\\{[^}]*\\}|[^>])*)(?:\\/>|>(?:(?!<\\/${tag}>).*?)<\\/${tag}>)`,
    'gs'
  )
}
