export interface GenerableProperty {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object'
  guide?: {
    description: string
  }
}

export interface GenerableSchema {
  name: string
  properties: Record<string, GenerableProperty>
}

export interface GenerableConfig {
  schemas: GenerableSchema[]
  tools?: Tool[]
  outputPath?: string
  moduleName?: string
}

export interface Tool {
  name: string
  description: string
  arguments: Record<string, GenerableProperty>
  functionName: string
  resultSchema?: Record<string, GenerableProperty>
}
