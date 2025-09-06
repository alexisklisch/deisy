import type { Plugin } from '@/plugins'

export interface DeisyConfig {
  variables: Record<string, any>
  plugins?: Plugin[]
}

export type Variant = string | undefined

export interface VariablesContext {
  template: Record<string, any>
  user: DeisyConfig['variables']
  metadata: Record<string, any>
}

export interface ExportOptions {
  format?: 'xml' | 'ast'
  variants?: Variant | Variant[]
}
