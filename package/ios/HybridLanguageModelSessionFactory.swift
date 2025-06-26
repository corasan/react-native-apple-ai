import NitroModules
import FoundationModels

/**
 * Custom configuration that uses HybridTool instead of HybridToolSpec
 */
struct CustomLanguageModelSessionConfig {
    let instructions: String?
    let tools: [HybridTool]?

    init(instructions: String? = nil, tools: [HybridTool]? = nil) {
        self.instructions = instructions
        self.tools = tools
    }
}

/**
 * Wrapper class that bridges the FoundationModels LanguageModelSession
 * with the Nitro interface FMLanguageModelSession.
 *
 * This wrapper encapsulates the actual FoundationModels session and provides
 * the interface methods required by the Nitro module system.
 */
class LanguageModelSessionWrapper {
    private let foundationSession: LanguageModelSession

    /**
     * Initializes the wrapper with a FoundationModels session configured
     * according to the provided configuration.
     *
     * - Parameter config: Custom configuration containing instructions and HybridTool instances
     * - Throws: Any errors that occur during session creation
     */
    init(config: CustomLanguageModelSessionConfig) throws {
        if let instructions = config.instructions {
            self.foundationSession = LanguageModelSession(instructions: instructions)
        } else if let tools = config.tools {
            let foundationTools: [any Tool] = tools.map { $0 as (any Tool) }
            self.foundationSession = LanguageModelSession(tools: foundationTools)
        } else {
            self.foundationSession = LanguageModelSession()
        }

        
    }

    /**
     * Implements the streaming response functionality required by the Nitro interface.
     * This method bridges the FoundationModels streaming API with the Nitro callback system.
     */
    func streamResponse() {
        Task {
            do {
                for try await response in foundationSession.streamResponse(to: "") {
                    print("Streaming response chunk: \(response)")
                }
            } catch {
                print("Error during streaming response: \(error)")
            }
        }
    }
}

/**
 * Factory class that creates LanguageModelSession instances.
 * This class implements the Nitro module specification and serves as the
 * bridge between React Native and Apple's FoundationModels framework.
 */
class HybridLanguageModelSessionFactory: HybridLanguageModelSessionFactorySpec {

    /**
     * Creates a new FMLanguageModelSession instance configured with the provided settings.
     *
     * - Parameter config: Configuration containing instructions and tools for the session
     * - Returns: A configured FMLanguageModelSession instance
     * - Throws: Any errors that occur during session creation
     */
    func createSession(config: LanguageModelSessionConfig) throws -> FMLanguageModelSession {
        // Convert from generated config to our custom config with HybridTool instances
        let hybridTools: [HybridTool]? = config.tools?.compactMap { toolSpec in
            return toolSpec as? HybridTool
        }

        let customConfig = CustomLanguageModelSessionConfig(
            instructions: config.instructions,
            tools: hybridTools
        )

        let wrapper = try LanguageModelSessionWrapper(config: customConfig)

        return FMLanguageModelSession(streamResponse: {
            wrapper.streamResponse()
        })
    }
}
