import NitroModules
import FoundationModels

/**
 * Wrapper class that bridges the FoundationModels LanguageModelSession
 * with the Nitro interface FMLanguageModelSession.
 *
 * This wrapper encapsulates the actual FoundationModels session and provides
 * the interface methods required by the Nitro module system.
 */

class FMLanguageModelSession: HybridFMLanguageModelSessionSpec {
    private let modelSession: LanguageModelSession?
    private var isResponding: Bool = false
    
    /**
     * Initializes the wrapper with a FoundationModels session configured
     * according to the provided configuration.
     *
     * - Parameter config: Custom configuration containing instructions and HybridTool instances
     * - Throws: Any errors that occur during session creation
     */
    init(config: CustomLanguageModelSessionConfig) throws {
        if let instructions = config.instructions {
            self.modelSession = LanguageModelSession(instructions: instructions)
        } else if let tools = config.tools {
            let foundationTools: [any Tool] = tools.map { $0 as (any Tool) }
            self.modelSession = LanguageModelSession(tools: foundationTools)
        } else {
            self.modelSession = LanguageModelSession()
        }
    }
    
    /**
     * Implements the streaming response functionality required by the Nitro interface.
     * This method bridges the FoundationModels streaming API with the Nitro callback system.
     */
    func streamResponse(prompt: String, onStream: @escaping (String) -> Void) throws -> Promise<String> {
        return Promise.async {
            guard let session = self.modelSession else {
                return "Error: Session not initialized"
            }
            
            self.isResponding = true
            do {
                let stream = session.streamResponse(to: prompt)
                for try await token in stream {
                    onStream(token)
                }

                let result = try await stream.collect()
                self.isResponding = false
                return result.content
            } catch {
                print("Error streaming response: \(error)")
                self.isResponding = false
                return ""
            }
        }
    }
}

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

