import { type HybridObject, NitroModules } from 'react-native-nitro-modules'
import type { Tool } from './Tool.nitro'

interface NativeLanguageModelSession {
  streamResponse: () => void
}

export interface NitroLanguageModelSession extends HybridObject<{ ios: 'swift' }> {
  session: (instructions?: string, tools?: Array<Tool>) => NativeLanguageModelSession
}

const HybridLanguageModelSession =
  NitroModules.createHybridObject<NitroLanguageModelSession>('NitroLanguageModelSession')

interface LanguageModelSessionConfig {
  instructions?: string
  tools?: Array<Tool>
}

/**
 * LanguageModelSession provides a bridge to Apple's native language model capabilities
 * for React Native applications. This class manages AI-powered conversations with
 * support for custom instructions and tool integration.
 *
 * @example
 * ```typescript
 * // Basic usage
 * const session = new LanguageModelSession();
 * session.streamResponse();
 *
 * // With custom instructions
 * const session = new LanguageModelSession("You are a helpful assistant");
 *
 * // With instructions and tools
 * const tools = [myCustomTool];
 * const session = new LanguageModelSession("You are a coding assistant", tools);
 * ```
 */
export class LanguageModelSession {
  private session: NativeLanguageModelSession

  /**
   * Creates a new LanguageModelSession instance
   *
   * @param instructions - Optional system instructions to guide the AI's behavior
   * @param tools - Optional array of tools that the AI can use during conversations
   */
  constructor(config?: LanguageModelSessionConfig) {
    this.session = HybridLanguageModelSession.session(config?.instructions, config?.tools)
  }

  /**
   * Initiates a streaming response from the language model
   * This method starts the AI conversation and streams the response back
   */
  streamResponse() {
    this.session.streamResponse()
  }
}
