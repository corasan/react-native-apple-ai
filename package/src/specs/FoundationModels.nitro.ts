import type { HybridObject } from 'react-native-nitro-modules'

export interface FoundationModels extends HybridObject<{ ios: 'swift' }> {
  initialize(instructions: string): void
  respond(prompt: string, generating?: string): Promise<string>
  streamResponse(
    prompt: string,
    onStream: (stream: string) => void,
    generating?: string,
  ): Promise<string>
  readonly isResponding: boolean
}
