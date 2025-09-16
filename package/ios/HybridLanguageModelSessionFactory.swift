import NitroModules
import FoundationModels

/**
 * Factory class that creates LanguageModelSession instances.
 * This class implements the Nitro module specification and serves as the
 * bridge between React Native and Apple's FoundationModels framework.
 */
@available(iOS 26.0, *)
class HybridLanguageModelSessionFactory: HybridLanguageModelSessionFactorySpec {
    private var tools: [any Tool] = []
    private let model = SystemLanguageModel.default

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

    var isAvailable: Bool {
        return model.isAvailable
    }

    var availabilityStatus: String {
        switch model.availability {
        case .available:
            return "available"
        case .unavailable(.deviceNotEligible):
            return "unavailable.deviceNotEligible"
        case .unavailable(.appleIntelligenceNotEnabled):
            return "unavailable.appleIntelligenceNotEnabled"
        case .unavailable(.modelNotReady):
            return "unavailable.modelNotReady"
        case .unavailable(let other):
            return "unavailable.unknown(\(other))"
        }
    }
}
