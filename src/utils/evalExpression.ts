interface EvalExpressionParams {
  expression: string
  variables?: Record<string, any>
}

export const evalExpression = ({
  expression = '',
  variables = {}
}: EvalExpressionParams) => {
  try {
    // Helper function to extract variables from the condition
    function extractVariables (expression: string) {
      // Looks for valid identifiers that are not reserved words
      const regex = /[a-zA-Z_$][a-zA-Z0-9_$]*/g
      const reservedWords = new Set([
        'true', 'false', 'null', 'undefined', 'return', 'if',
        'else', 'var', 'let', 'const', 'function', 'new',
        'this', 'super', 'class', 'extends', 'for', 'while',
        'do', 'break', 'continue', 'switch', 'case', 'default',
        'try', 'catch', 'finally', 'throw', 'typeof', 'instanceof',
        'void', 'delete', 'in', 'of', 'from', 'as', 'async',
        'await', 'yield', 'import', 'export', 'module'
      ])

      const matches = expression.match(regex) || []
      return [...new Set(matches)].filter(word => !reservedWords.has(word))
    }
    // Extract all variables used in the condition
    const possibleVariables = extractVariables(expression)

    // Create a new context that includes all the necessary variables
    const fullVarsContext: Record<string, any> = {}
    for (const variable of possibleVariables) {
      // If the variable exists in the variables object, use that value
      if (Object.prototype.hasOwnProperty.call(variables, variable)) {
        fullVarsContext[variable] = variables[variable]
      } else {
        continue // If not, skip
      }
    }

    // Create a new function with the full context
    // eslint-disable-next-line no-new-func
    const fn = new Function(
      ...Object.keys(fullVarsContext),
      `return ${expression};`
    )

    return fn(...Object.values(fullVarsContext))
  } catch (error) {
    console.error(`Error evaluating expression: ${expression}`, error)
    return undefined
  }
}
