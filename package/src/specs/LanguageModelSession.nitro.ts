import type { AnyMap, HybridObject } from 'react-native-nitro-modules'

export interface ToolDefinition {
  name: string
  description: string
  arguments: AnyMap
  implementation: () => Promise<AnyMap>
}

export interface LanguageModelSessionConfig {
  instructions?: string
  tools?: Array<ToolDefinition>
}

export interface LanguageModelSession extends HybridObject<{ ios: 'swift' }> {
  streamResponse(prompt: string, onStream: (stream: string) => void): Promise<string>
}

export interface LanguageModelSessionFactory extends HybridObject<{ ios: 'swift' }> {
  create(config: LanguageModelSessionConfig): LanguageModelSession
}
