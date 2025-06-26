import FoundationModels
import NitroModules

class HybridToolFactory: HybridToolFactorySpec {
    func create(config: ToolConfig) throws -> HybridToolSpec {
//        guard let name = config.name as? String,
//        let description = config.description as? String,
//        let call = config.call as? (_ params: AnyMap) -> Promise<Promise<AnyMap>> else {
//            print("Error: Invalid tool configuration")
//        }
        let name = config.name
        let description = config.description
        let arguments = config.arguments
//        let call = config.call
        
        print("Tool with name \(name) and description: \(description)")
        print(arguments)
        
        return HybridTool(name: name, description: description, arguments: arguments)
    }
}
