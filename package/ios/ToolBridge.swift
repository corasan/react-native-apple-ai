import NitroModules

class ToolBridge: HybridToolBridgeSpec {
    static let shared = ToolBridge()
    private var jsImplementations: [String: () -> Void] = [:]

    func registerJSFunction(name: String, implementation: @escaping () -> Void) throws -> Promise<Void> {
        Promise.async {
            print("Registering this function: \(name)")
            ToolBridge.shared.jsImplementations[name] = implementation
        }
    }

    func callJSFunction(functionName: String, args: Dictionary<String, String>) throws -> Promise<Void> {
        return Promise.async {
            guard ToolBridge.shared.jsImplementations[functionName] != nil else {
                print("The function you are trying to call doesn't exist: \(functionName)")
                return
            }
            print("Calling this function: \(functionName)")
            ToolBridge.shared.jsImplementations[functionName]?()
        }
    }
}
