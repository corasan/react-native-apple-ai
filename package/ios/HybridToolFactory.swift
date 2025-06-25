import FoundationModels
import NitroModules

class HybridToolFactory: HybridToolFactorySpec {
//    private var _arguments: []
    
    func create(config: ToolConfig) {
//        guard let name = config.name as? String,
//        let description = config.description as? String,
//        let call = config.call as? (_ params: AnyMap) -> Promise<Promise<AnyMap>> else {
//            print("Error: Invalid tool configuration")
//        }
        let name = config.name
        let description = config.description
        let arguments = config.arguments
        let call = config.call
    }
}


struct NitroTool: Tool {
    private let config: ToolConfig
    let name: String
    let description: String
    let params: AnyMapHolder
    
    init(config: ToolConfig) {
        self.config = config
        self.name = config.name
        self.description = config.description
        self.params = config.arguments
    }
    
    typealias Arguments = GeneratedContent
    
    func call(arguments: GeneratedContent) async throws -> ToolOutput {
        
    }
    
//    var name: String {
//        return config.name
//    }
//    
//    var description: String {
//        return config.description
//    }
    
//    var arguments: JSONSchema? {
//        guard let params = config.parameters else { return nil }
//        
//        do {
//            let jsonData = try JSONSerialization.data(withJSONObject: params)
//            return try JSONDecoder().decode(JSONSchema.self, from: jsonData)
//        } catch {
//            print("Failed to convert parameters to JSONSchema: \(error)")
//            return nil
//        }
//    }
//    
//    func invoke(with parameters: [String: Any]) async throws -> String {
//        let inner = try await config.call(parameters).await()
//        return try await inner.await()
//    }
}
