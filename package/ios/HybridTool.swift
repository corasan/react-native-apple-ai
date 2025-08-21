import FoundationModels
import NitroModules

struct HybridTool: Tool, @unchecked Sendable {
    var name: String
    var description: String
    var parameters: GenerationSchema
//    var arguments: AnyMap
    var implementation: () -> Promise<Promise<AnyMapHolder>>
//    private let argumentsSchema: GenerationSchema
    
    /// Throws if schema creation fails.
    init(name: String, description: String, parameters: AnyMap, implementation: @escaping () -> Promise<Promise<AnyMapHolder>>) throws {
        self.name = name
        self.description = description
        self.implementation = implementation
        let dynamicSchema = DynamicGenerationSchema(
            name: "Weather",
            properties: [
                DynamicGenerationSchema.Property(
                    name: "city",
                    schema: DynamicGenerationSchema(type: String.self)
                )
            ]
        )
        self.parameters = try GenerationSchema(root: dynamicSchema, dependencies: [])
        
//        self.argumentsSchema = Self.createGenerationSchema(from: parameters)
        let p = parameters.getAllKeys().joined(separator: ", ")
        print("Initialized Tool: \(name) with schema: \(p)")
    }
    
    func call(arguments: GeneratedContent) async throws -> String {
        print("Tool \(name) called with arguments: \(arguments)")
        
        return ""
    }
    
    // MARK: - Helper Methods
    
//    private static func createGenerationSchema(from anyMap: AnyMap) -> GenerationSchema {
//        let keys = anyMap.getAllKeys()
//        var properties: [String: DynamicGenerationSchema] = [:]
//        
//        // Build the schema properties from the AnyMap
//        for key in keys {
//            // Handle nested AnyMap (object), arrays, or primitive types
//            if anyMap.isString(key: key) {
//                let typeString = anyMap.getString(key: key)
//                properties[key] = createDynamicSchema(for: typeString)
//            } else if anyMap.isDouble(key: key) {
//                properties[key] = DynamicGenerationSchema(type: Double.self)
//            } else if anyMap.isBool(key: key) {
//                properties[key] = DynamicGenerationSchema(type: Bool.self)
//            } else if anyMap.isArray(key: key) {
//                // For arrays, try to infer the schema from the first element, or default to string
//                let arrayValue = anyMap.getArray(key: key)
//                if let first = arrayValue.first {
//                    properties[key] = DynamicGenerationSchema.array(createDynamicSchema(for: first))
//                } else {
//                    properties[key] = DynamicGenerationSchema.array(DynamicGenerationSchema(type: String.self))
//                }
//            } else {
//                // Fallback to String
//                properties[key] = DynamicGenerationSchema(type: String.self)
//            }
//        }
//        return GenerationSchema(properties: properties)
//    }
    
//    private static func createDynamicSchema(for value: Any) -> DynamicGenerationSchema {
//        switch value {
//        case let typeString as String:
//            switch typeString.lowercased() {
//            case "string":
//                return DynamicGenerationSchema(type: String.self)
//            case "number", "double", "int", "float":
//                return DynamicGenerationSchema(type: Double.self)
//            case "boolean", "bool":
//                return DynamicGenerationSchema(type: Bool.self)
//            default:
//                return DynamicGenerationSchema(type: String.self)
//            }
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
//        default:
//            return DynamicGenerationSchema(type: String.self)
//        }
//    }
    
    private static func convertGeneratedContentToAnyMap(_ content: GeneratedContent) -> AnyMap {
//        let properties: [String: Any]
//        if let dict = content.properties as? [String: Any] {
//            properties = dict
//        } else {
//            properties = [:]
//        }
        let anyMap = AnyMapHolder()
//        for (key, value) in properties {
//            switch value {
//            case let stringValue as String:
//                anyMap.setString(key: key, value: stringValue)
//            case let doubleValue as Double:
//                anyMap.setDouble(key: key, value: doubleValue)
//            case let intValue as Int:
//                anyMap.setDouble(key: key, value: Double(intValue))
//            case let boolValue as Bool:
//                anyMap.setBoolean(key: key, value: boolValue)
//            default:
//                anyMap.setString(key: key, value: String(describing: value))
//            }
//        }
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
