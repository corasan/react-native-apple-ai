import { NitroModules } from 'react-native-nitro-modules'
import type {
  FMLanguageModelSession,
  LanguageModelSessionConfig,
  LanguageModelSessionFactory,
} from './specs/LanguageModelSessionFactory.nitro'

const HybridLanguageModelSession =
  NitroModules.createHybridObject<LanguageModelSessionFactory>(
    'LanguageModelSessionFactory',
  )

/**
 * LanguageModelSession provides a bridge to Apple's native language model capabilities
 * for React Native applications. This class manages AI-powered conversations with
 * support for custom instructions and tool integration.
 *
 * @example
 * ```typescript
 * const session = new LanguageModelSession();
 *
 * // With custom instructions
 * const session = new LanguageModelSession({
 *   instructions: "You are a helpful assistant"
 * });
 *
 * // With instructions and tools
 * const tools = [myCustomTool];
 * const session = new LanguageModelSession({
 *   instructions: "You are a coding assistant",
 *   tools
 * });
 * ```
 */
export class LanguageModelSession {
  private session: FMLanguageModelSession

  /**
   * Creates a new LanguageModelSession instance
   *
   * @param instructions - Optional system instructions to guide the AI's behavior
   * @param tools - Optional array of tools that the AI can use during conversations
   */
  constructor(config?: LanguageModelSessionConfig) {
    this.session = HybridLanguageModelSession.createSession({
      instructions: config?.instructions,
      tools: config?.tools,
    })
  }

  /**
   * Initiates a streaming response from the language model
   * This method starts the AI conversation and streams the response back
   */
  streamResponse() {
    this.session.streamResponse()
  }
}
