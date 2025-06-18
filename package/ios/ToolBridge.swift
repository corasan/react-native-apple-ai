import NitroModules

class ToolBridge: HybridToolBridgeSpec {
    static let shared = ToolBridge()
    private var jsImplementations: [String: () -> Promise<AnyMapHolder>] = [:]

    func registerJSFunction(name: String, implementation: @escaping () -> Promise<AnyMapHolder>) throws -> Void {
        ToolBridge.shared.jsImplementations[name] = implementation
    }

    func callJSFunction(functionName: String) async throws -> AnyMapHolder {
        guard let function = ToolBridge.shared.jsImplementations[functionName] else {
            print("The function you are trying to call doesn't exist: \(functionName)")
            throw ToolError.unknown
        }
        return try await function().await()
    }
}

enum ToolError: Error {
    case unknown
}
