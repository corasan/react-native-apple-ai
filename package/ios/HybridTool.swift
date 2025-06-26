import FoundationModels
import NitroModules

class HybridTool: HybridToolSpec, Tool, @unchecked Sendable {
    func call() throws -> Promise<NitroModules.AnyMapHolder> {
        <#code#>
    }
    
    let name: String
    let description: String
    var arguments: AnyMap
    
    init(name: String, description: String, arguments: AnyMap) {
        self.name = name
        self.description = description
        self.arguments = arguments
    }
    
    typealias Arguments = GeneratedContent
    
    func call(arguments: GeneratedContent) async throws -> ToolOutput {
        return ToolOutput(GeneratedContent(properties: ["name": "Henry"]))
    }
}
