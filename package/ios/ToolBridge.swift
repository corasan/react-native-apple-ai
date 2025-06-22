import NitroModules
import FoundationModels

typealias AnyMap = AnyMapHolder

class ToolBridge: HybridToolBridgeSpec {
    static let shared = ToolBridge()
    private var jsImplementations: [String: (_ args: AnyMap) -> Promise<Promise<AnyMap>>] = [:]

    func registerJSFunction(name: String, implementation: @escaping (_ args: AnyMap) -> Promise<Promise<AnyMap>>) throws -> Void {
        ToolBridge.shared.jsImplementations[name] = implementation
    }

    func callJSFunction(functionName: String, args: AnyMapHolder) async throws -> AnyMapHolder {
        guard let function = ToolBridge.shared.jsImplementations[functionName] else {
            print("The function you are trying to call doesn't exist: \(functionName)")
            throw ToolError.unknown
        }
        let outer = try await function(args).await()
        return try await outer.await()
    }
}

enum ToolError: Error {
    case unknown
}
