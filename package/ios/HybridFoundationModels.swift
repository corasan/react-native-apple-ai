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
}
