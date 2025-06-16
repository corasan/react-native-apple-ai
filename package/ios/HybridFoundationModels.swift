import Foundation
import NitroModules
import FoundationModels

class HybridFoundationModels: HybridFoundationModelsSpec {

    func hello(name: String) -> String {
        
        return "Hello \(name) from FoundationModels!"
    }

    func add(a: Double, b: Double) -> Double {
        return a + b
    }
}

class MyLLM {
    static func respond<Content>(generating: Content.Type = Content.self) async throws where Content: Generable {
        let session = LanguageModelSession()
        let res = try await session.respond(to: "Hello", generating: generating)
    }
}
