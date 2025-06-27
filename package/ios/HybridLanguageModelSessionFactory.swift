import NitroModules
import FoundationModels

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
    func createSession(config: LanguageModelSessionConfig) throws -> any HybridFMLanguageModelSessionSpec {
        let hybridTools: [HybridTool]? = config.tools?.compactMap { toolSpec in
            return toolSpec as? HybridTool
        }

        let customConfig = CustomLanguageModelSessionConfig(
            instructions: config.instructions,
            tools: hybridTools
        )

        return try FMLanguageModelSession(config: customConfig) as any HybridFMLanguageModelSessionSpec
    }
}
