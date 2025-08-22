import type { AnyMap } from 'react-native-nitro-modules'
import { z } from 'zod'
import type {
  ToolDefinition,
  TypeSafeToolDefinition,
  ZodObjectSchema,
} from './specs/LanguageModelSession.nitro'
import {
  SchemaCreationError,
  ArgumentParsingError,
  ResponseParsingError,
  parseNativeError
} from './errors'

/**
 * Converts a Zod schema to an AnyMap format that the native code can understand
 */
function zodSchemaToAnyMap(schema: z.ZodObject<any>): AnyMap {
  try {
    const anyMap = new Map<string, any>()

    const shape = schema.shape

    for (const [key, zodType] of Object.entries(shape)) {
      try {
        const type = getZodTypeString(zodType as z.ZodTypeAny)
        anyMap.set(key, type)
      } catch (error) {
        throw new SchemaCreationError(
          `Failed to convert property '${key}' to native type`,
          { property: key, zodType: zodType.constructor.name, originalError: error }
        )
      }
    }

    // Convert Map to plain object and then to AnyMap
    return Object.fromEntries(anyMap) as AnyMap
  } catch (error) {
    if (error instanceof SchemaCreationError) {
      throw error
    }
    throw new SchemaCreationError(
      'Failed to convert Zod schema to AnyMap',
      { schemaKeys: Object.keys(schema.shape), originalError: error }
    )
  }
}

/**
 * Gets the string representation of a Zod type for native code
 */
function getZodTypeString(zodType: z.ZodTypeAny): string {
  const typeName = zodType._def.typeName

  switch (typeName) {
    case z.ZodFirstPartyTypeKind.ZodString:
      return 'string'
    case z.ZodFirstPartyTypeKind.ZodNumber:
      return 'number'
    case z.ZodFirstPartyTypeKind.ZodBoolean:
      return 'boolean'
    case z.ZodFirstPartyTypeKind.ZodArray:
      return 'array'
    case z.ZodFirstPartyTypeKind.ZodObject:
      return 'object'
    default:
      return 'string' // Default fallback
  }
}

/**
 * Creates a type-safe tool definition that converts the Zod schema to AnyMap
 */
export function createTool<T extends ZodObjectSchema>(
  definition: TypeSafeToolDefinition<T>,
): ToolDefinition {
  try {
    const argumentsSchema = zodSchemaToAnyMap(definition.arguments)
    
    return {
      name: definition.name,
      description: definition.description,
      arguments: argumentsSchema,
      implementation: async (args: AnyMap) => {
        try {
          // Parse and validate the arguments using Zod
          const parsedArgs = definition.arguments.parse(args)

          // Call the type-safe implementation
          const result = await definition.implementation(parsedArgs)

          // Validate that result is AnyMap-compatible
          if (result === null || result === undefined) {
            throw new ResponseParsingError('Tool implementation returned null or undefined')
          }

          if (typeof result !== 'object') {
            throw new ResponseParsingError(
              `Tool implementation must return an object, got ${typeof result}`,
              { returnedType: typeof result, returnedValue: result }
            )
          }

          // Return the result (convert to AnyMap if needed)
          return result as AnyMap
        } catch (error) {
          if (error instanceof z.ZodError) {
            throw new ArgumentParsingError(
              `Invalid arguments for tool '${definition.name}'`,
              {
                toolName: definition.name,
                zodErrors: error.errors,
                receivedArgs: args
              }
            )
          }
          
          if (error instanceof ArgumentParsingError || error instanceof ResponseParsingError) {
            throw error
          }

          // Handle implementation errors
          throw parseNativeError(error)
        }
      },
    }
  } catch (error) {
    if (error instanceof SchemaCreationError) {
      throw error
    }
    throw new SchemaCreationError(
      `Failed to create tool '${definition.name}'`,
      { toolName: definition.name, originalError: error }
    )
  }
}
