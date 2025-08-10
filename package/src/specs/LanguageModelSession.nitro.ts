import type { AnyMap, HybridObject } from 'react-native-nitro-modules'

export interface Tool {
  name: string
  description: string
  arguments: AnyMap
  implementation: Promise<AnyMap>
}

export interface LanguageModelSession extends HybridObject<{ ios: 'swift' }> {
  streamResponse(prompt: string, onStream: (stream: string) => void): Promise<string>
}

export interface LanguageModelSessionConfig {
  instructions?: string
  tools?: Array<Tool>
}

export interface LanguageModelSessionFactory extends HybridObject<{ ios: 'swift' }> {
  createSession(config: LanguageModelSessionConfig): LanguageModelSession
}
