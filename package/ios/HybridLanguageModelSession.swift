import NitroModules
import FoundationModels

class HybridLanguageModelSession: HybridLanguageModelSessionSpec {
    private var session: LanguageModelSession? = nil
    private var isResponding: Bool = false
    private var tools: [any Tool] = []
    private var jsTools: [ToolDefinition] = []
    
    /**
     * Initializes the wrapper with a FoundationModels session configured
     * according to the provided configuration.
     *
     * - Parameter config: Custom configuration containing instructions and HybridTool instances
     * - Throws: Any errors that occur during session creation
     */
    init(config: LanguageModelSessionConfig) throws {
        let jsTools: [ToolDefinition] = config.tools ?? []
        var tools: [any Tool] = []
        
        if (!jsTools.isEmpty) {
            tools = try jsTools.map { tool in
                return try HybridTool(
                    name: tool.name,
                    description: tool.description,
                    parameters: tool.arguments,
                    implementation: tool.implementation
                )
            }
        }
        
        let session = LanguageModelSession(tools: tools, instructions: config.instructions)
        self.session = session
    }
    
    /**
     * Implements the streaming response functionality required by the Nitro interface.
     * This method bridges the FoundationModels streaming API with the Nitro callback system.
     */
    func streamResponse(prompt: String, onStream: @escaping (String) -> Void) throws -> Promise<String> {
        return Promise.async {
            guard let modelSession = self.session else {
                return "Error: Session not initialized"
            }
                        
            self.isResponding = true
            do {
                let stream = modelSession.streamResponse(to: prompt)
                for try await token in stream {
                    onStream(token.content)
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
