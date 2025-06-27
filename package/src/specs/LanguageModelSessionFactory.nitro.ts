import type { HybridObject } from 'react-native-nitro-modules'
import type { Tool } from './Tool.nitro'

export interface FMLanguageModelSession extends HybridObject<{ ios: 'swift' }> {
  streamResponse(
    prompt: string,
    onStream: (stream: string) => void,
  ): Promise<string>
}

export interface LanguageModelSessionConfig {
  instructions?: string
  tools?: Array<Tool>
}

export interface LanguageModelSessionFactory extends HybridObject<{ ios: 'swift' }> {
  createSession(config: LanguageModelSessionConfig): FMLanguageModelSession
}
