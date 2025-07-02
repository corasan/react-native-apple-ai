import FoundationModels
import NitroModules

class HybridTool: HybridToolSpec, Tool, @unchecked Sendable {
    let name: String
    let description: String
    var arguments: AnyMap
    var action: ((AnyMap) async throws -> Promise<AnyMap>)?
    private let argumentsSchema: GenerationSchema
    
    init(name: String, description: String, arguments: AnyMap, action: @escaping (AnyMap) async throws -> Promise<AnyMap>) {
        self.name = name
        self.description = description
        self.arguments = arguments
        self.action = action
        
        self.argumentsSchema = Self.createGenerationSchema(from: arguments)
        print("Initialized Tool: \(name) with schema: \(argumentsSchema)")
    }
    
    // Use the generated schema as the Arguments type
    typealias Arguments = GeneratedContent
    
    // This property tells Foundation Models what schema to use for this tool
    var argumentsGenerationSchema: GenerationSchema {
        return argumentsSchema
    }
    
    func call(arguments: GeneratedContent) async throws -> ToolOutput {
        print("Tool \(name) called with arguments: \(arguments)")
        
        let anyMapArgs = Self.convertGeneratedContentToAnyMap(arguments)
        
        if let action = self.action {
            let promiseRes = Promise.async { try await action(anyMapArgs).await() }
            let result = try await promiseRes.await()
            
            return ToolOutput(Self.convertAnyMapToGeneratedContent(result))
        }
        
        return ToolOutput(GeneratedContent(properties: [:]))
    }
    
    // MARK: - Helper Methods
    
    private static func createGenerationSchema(from anyMap: AnyMap) -> GenerationSchema {
        // Get all keys from the argument schema passed from JavaScript
        let keys = anyMap.getAllKeys()
        var properties: [String: DynamicGenerationSchema] = [:]
        
        // Build the schema properties from the AnyMap
        for key in keys {
            if anyMap.isString(key: key) {
                let typeString = anyMap.getString(key: key)
                properties[key] = createDynamicSchema(for: typeString)
            }
        }
        
        // Create a dictionary schema with the properties
        let rootSchema = DynamicGenerationSchema(
            name: "Schema",
            properties: [
                DynamicGenerationSchema.Property(
                    name: "city",
                    schema: DynamicGenerationSchema(name: "city", anyOf: [DynamicGenerationSchema(type: String.self)])
                )
            ])
        
        do {
            return try GenerationSchema(root: rootSchema, dependencies: [])
        } catch {
            print("Error creating GenerationSchema: \(error)")
            // Fallback to a simple string schema
            let fallbackSchema = DynamicGenerationSchema(type: String.self)
            return try! GenerationSchema(root: fallbackSchema, dependencies: [])
        }
    }
    
    private static func createDynamicSchema(for value: Any) -> DynamicGenerationSchema {
        switch value {
        case let typeString as String:
            switch typeString.lowercased() {
            case "string":
                return DynamicGenerationSchema(type: String.self)
            case "number", "double", "int", "float":
                return DynamicGenerationSchema(type: Double.self)
            case "boolean", "bool":
                return DynamicGenerationSchema(type: Bool.self)
            default:
                return DynamicGenerationSchema(type: String.self)
            }
//        case let arrayValue as [Any]:
//            // For arrays, use the first element to determine type, or default to string
//            if let firstElement = arrayValue.first {
//                return DynamicGenerationSchema.array(createDynamicSchema(for: firstElement))
//            } else {
//                return DynamicGenerationSchema.array(DynamicGenerationSchema(type: String.self))
//            }
//        case let dictValue as [String: Any]:
//            var properties: [String: DynamicGenerationSchema] = [:]
//            for (key, val) in dictValue {
//                properties[key] = createDynamicSchema(for: val)
//            }
//            return DynamicGenerationSchema.dictionary(Dictionary(uniqueKeysWithValues: properties.map { ($0.key, $0.value) }))
        default:
            return DynamicGenerationSchema(type: String.self)
        }
    }
    
    private static func convertGeneratedContentToAnyMap(_ content: GeneratedContent) -> AnyMap {
        let properties: [String: Any]
        if let dict = content.properties as? [String: Any] {
            properties = dict
        } else {
            properties = [:]
        }
        let anyMap = AnyMapHolder()
        for (key, value) in properties {
            switch value {
            case let stringValue as String:
                anyMap.setString(key: key, value: stringValue)
            case let doubleValue as Double:
                anyMap.setDouble(key: key, value: doubleValue)
            case let intValue as Int:
                anyMap.setDouble(key: key, value: Double(intValue))
            case let boolValue as Bool:
                anyMap.setBoolean(key: key, value: boolValue)
            default:
                anyMap.setString(key: key, value: String(describing: value))
            }
        }
        return anyMap
    }
    
    private static func convertAnyMapToGeneratedContent(_ anyMap: AnyMap) -> GeneratedContent {
        let keys = anyMap.getAllKeys()
        var keyValuePairs: [(String, any ConvertibleToGeneratedContent)] = []
        
        for key in keys {
            if anyMap.isString(key: key) {
                keyValuePairs.append((key, anyMap.getString(key: key)))
            } else if anyMap.isDouble(key: key) {
                keyValuePairs.append((key, anyMap.getDouble(key: key)))
            } else if anyMap.isBool(key: key) {
                keyValuePairs.append((key, anyMap.getBoolean(key: key)))
            }
        }
        
        let kvp = unsafeBitCast(
            DynamicKeyValuePairs(_elements: keyValuePairs),
            to: KeyValuePairs<String, any ConvertibleToGeneratedContent>.self
        )
        
        return GeneratedContent(properties: kvp)
    }
}

struct DynamicKeyValuePairs<K, V> {
    let _elements: [(K, V)]
    
    init(_elements: [(K, V)]) {
        self._elements = _elements
    }
}
