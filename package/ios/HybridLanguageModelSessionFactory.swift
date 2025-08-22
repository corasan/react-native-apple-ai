import NitroModules
import FoundationModels

/**
 * Factory class that creates LanguageModelSession instances.
 * This class implements the Nitro module specification and serves as the
 * bridge between React Native and Apple's FoundationModels framework.
 */
class HybridLanguageModelSessionFactory: HybridLanguageModelSessionFactorySpec {
    private var tools: [any Tool] = []
    /**
     * Creates a new FMLanguageModelSession instance configured with the provided settings.
     *
     * - Parameter config: Configuration containing instructions and tools for the session
     * - Returns: A configured FMLanguageModelSession instance
     * - Throws: Any errors that occur during session creation
     */
    func create(config: LanguageModelSessionConfig) throws -> HybridLanguageModelSessionSpec {
        return try HybridLanguageModelSession(config: config)
    }
    
    private func privateCreateTool(params: ToolDefinition) {
        
    }
}
