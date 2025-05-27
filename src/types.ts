export interface DeisyConfig {
  variables: Record<string, any>
}

export type Variant = string | undefined

export interface VariablesContext {
  template: Record<string, any>
  user: DeisyConfig['variables']
  metadata: Record<string, any>
}

export interface ExportOptions {
  format: 'xml' | 'json'
  variants: Variant | Variant[]
}
