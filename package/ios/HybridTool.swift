import NitroModules
import FoundationModels

@available(iOS 26.0, *)
struct HybridTool: Tool, @unchecked Sendable {
    var name: String
    var description: String
    var parameters: GenerationSchema
    var handler: (AnyMap) -> Promise<Promise<AnyMap>>
    
    init(name: String, description: String, parameters: AnyMap, handler: @escaping (AnyMap) -> Promise<Promise<AnyMap>>) throws {
        self.name = name
        self.description = description
        self.handler = handler
        do {
            self.parameters = try Self.createGenerationSchema(from: parameters)
        } catch {
            throw AppleAIError.schemaCreationError("Failed to create schema for tool '\(name)': \(error.localizedDescription)")
        }
    }
    
    func call(arguments: GeneratedContent) async throws -> some Generable {
        do {
            let argumentsMap = Self.convertGeneratedContentToAnyMap(arguments)
            let resultPromise = handler(argumentsMap)
            
            let result: Promise<AnyMap>
            do {
                result = try await resultPromise.await()
            } catch {
                throw AppleAIError.toolExecutionError(name, error)
            }
            
            let resultMap: AnyMap
            do {
                resultMap = try await result.await()
            } catch {
                throw AppleAIError.toolExecutionError(name, error)
            }
            
            return Self.convertAnyMapToGeneratedContent(resultMap)
        } catch let error as AppleAIError {
            throw error
        } catch {
            throw AppleAIError.toolCallError(error)
        }
    }
    
    // MARK: - Helper Methods
    
    private static func createGenerationSchema(from anyMap: AnyMap) throws -> GenerationSchema {
        let keys = anyMap.getAllKeys()
        var properties: [DynamicGenerationSchema.Property] = []
        
        for key in keys {
            let schema = try createDynamicSchema(from: anyMap, key: key)
            properties.append(DynamicGenerationSchema.Property(name: key, schema: schema))
        }
        
        let dynamicSchema = DynamicGenerationSchema(
            name: "ToolParameters",
            properties: properties
        )
        
        return try GenerationSchema(root: dynamicSchema, dependencies: [])
    }
    
    
    private static func createDynamicSchema(from anyMap: AnyMap, key: String) throws -> DynamicGenerationSchema {
        if anyMap.isString(key: key) {
            let typeString = anyMap.getString(key: key)
            return createSchemaFromTypeString(typeString)
        } else if anyMap.isDouble(key: key) {
            return DynamicGenerationSchema(type: Double.self)
        } else if anyMap.isBool(key: key) {
            return DynamicGenerationSchema(type: Bool.self)
        } else {
            return DynamicGenerationSchema(type: String.self)
        }
    }
    
    private static func createSchemaFromTypeString(_ typeString: String) -> DynamicGenerationSchema {
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
    }
    
    private static func convertGeneratedContentToAnyMap(_ content: GeneratedContent) -> AnyMap {
        let anyMap = AnyMap()
        let jsonString = content.jsonString
        
        guard !jsonString.isEmpty else {
            return anyMap
        }
        
        guard let jsonData = jsonString.data(using: .utf8) else {
            return anyMap
        }
        
        do {
            guard let jsonObject = try JSONSerialization.jsonObject(with: jsonData, options: []) as? [String: Any] else {
                return anyMap
            }
            
            for (key, value) in jsonObject {
                switch value {
                case let stringValue as String:
                    anyMap.setString(key: key, value: stringValue)
                case let doubleValue as Double:
                    anyMap.setDouble(key: key, value: doubleValue)
                case let intValue as Int:
                    anyMap.setDouble(key: key, value: Double(intValue))
                case let boolValue as Bool:
                    anyMap.setBoolean(key: key, value: boolValue)
                case is NSNull:
                    anyMap.setString(key: key, value: "")
                default:
                    anyMap.setString(key: key, value: String(describing: value))
                }
            }
        } catch {
            // Log parsing error but return empty map to avoid crashing
            print("Warning: Failed to parse GeneratedContent JSON: \(error.localizedDescription)")
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
