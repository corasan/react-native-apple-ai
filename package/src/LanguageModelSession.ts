import { NitroModules } from 'react-native-nitro-modules'
import type {
  LanguageModelSessionConfig,
  LanguageModelSessionFactory as LanguageModelSessionFactorySpec,
  LanguageModelSession as LanguageModelSessionSpec,
} from './specs/LanguageModelSession.nitro'
import type { AvailabilityStatus, FoundationModelsAvailability } from './types'

const LanguageModelSessionFactory =
  NitroModules.createHybridObject<LanguageModelSessionFactorySpec>(
    'LanguageModelSessionFactory',
  )

/**
 * Gets a human-readable message for the availability status
 */
function getAvailabilityMessage(status: AvailabilityStatus): string {
  switch (status) {
    case 'available':
      return 'Foundation Models is available and ready to use'
    case 'unavailable.platformNotSupported':
      return 'Foundation Models requires iOS 26.0 or later'
    case 'unavailable.deviceNotEligible':
      return 'This device does not support Apple Intelligence'
    case 'unavailable.appleIntelligenceNotEnabled':
      return 'Apple Intelligence is not enabled in Settings'
    case 'unavailable.modelNotReady':
      return 'The model is downloading or not ready for other system reasons'
    case 'unavailable.unknown':
      return 'Foundation Models is unavailable for an unknown reason'
    default:
      return 'Foundation Models availability status is unknown'
  }
}

/**
 * Checks the availability of Foundation Models
 * @returns FoundationModelsAvailability object with detailed status
 */
export function checkFoundationModelsAvailability(): FoundationModelsAvailability {
  try {
    const isAvailable = LanguageModelSessionFactory.isAvailable
    const statusString = LanguageModelSessionFactory.availabilityStatus
    const status = statusString.startsWith('unavailable.unknown(')
      ? ('unavailable.unknown' as const)
      : (statusString as AvailabilityStatus)

    return {
      isAvailable,
      status,
      message: getAvailabilityMessage(status),
    }
  } catch (error) {
    return {
      isAvailable: false,
      status: 'unavailable.platformNotSupported',
      message: getAvailabilityMessage('unavailable.platformNotSupported'),
    }
  }
}

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
  session: LanguageModelSessionSpec

  /**
   * Creates a new LanguageModelSession instance
   *
   * @param instructions - Optional system instructions to guide the AI's behavior
   * @param tools - Optional array of tools that the AI can use during conversations
   */
  constructor(config?: LanguageModelSessionConfig) {
    const availability = checkFoundationModelsAvailability()
    if (!availability.isAvailable) {
      throw new Error(`Foundation Models is not available: ${availability.message}`)
    }

    this.session = LanguageModelSessionFactory.create({
      instructions: config?.instructions,
      tools: config?.tools,
    })
  }

  /**
   * Initiates a streaming response from the language model
   * This method starts the AI conversation and streams the response back
   */
  streamResponse(prompt: string, callback: (token: string) => void) {
    this.session.streamResponse(prompt, callback)
  }
}
