import type { HybridObject } from 'react-native-nitro-modules'
import type { Tool } from './Tool.nitro'

export interface FMLanguageModelSession {
  streamResponse(): void
}

export interface LanguageModelSessionConfig {
  instructions?: string
  tools?: Array<Tool>
}

export interface LanguageModelSessionFactory extends HybridObject<{ ios: 'swift' }> {
  createSession(config: LanguageModelSessionConfig): FMLanguageModelSession
}
