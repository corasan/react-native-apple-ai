import Foundation
import NitroModules
import FoundationModels

let session = LanguageModelSession()

class HybridFoundationModels: HybridFoundationModelsSpec {

    func hello(name: String) -> String {
        
        return "Hello \(name) from FoundationModels!"
    }

    func add(a: Double, b: Double) -> Double {
        return a + b
    }
    
    func respond(generating: String) throws -> Promise<String> {
        print("The supposed generating: \(generating)")
        return Promise.async {
            let response = try await session.respond(generating: User.self) {
                "Create a user"
            }
            print(response.content)
            return response.content.name
        }
    }
}
