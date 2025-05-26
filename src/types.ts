export interface DaisyConfig {
  variables: Record<string, any>
}

export type Variant = string | undefined

export interface VariablesContext {
  template: Record<string, any>
  user: DaisyConfig['variables']
  metadata: Record<string, any>
}

export interface ExportOptions {
  format: 'xml' | 'json'
  variant: Variant | Variant[]
}
