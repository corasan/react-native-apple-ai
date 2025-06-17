import Foundation
import NitroModules
import FoundationModels

let session = LanguageModelSession(instructions: "You are a helpful assistant")

class HybridFoundationModels: HybridFoundationModelsSpec {

    func hello(name: String) -> String {
        
        return "Hello \(name) from FoundationModels!"
    }

    func add(a: Double, b: Double) -> Double {
        return a + b
    }
    
    func respond(generating: String, prompt: String) throws -> Promise<String> {
        return Promise.async {
            guard let structType = GenerableTypes(fromString: generating) else {
                print("Error: Unknown struct \(generating)")
                return "My name is Unknown"
            }
            let response = try await structType.generate(session: session) {
                prompt
            }
            return "My name is \(response.content.name)"
        }
    }
}
