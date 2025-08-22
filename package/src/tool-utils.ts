import type { AnyMap } from 'react-native-nitro-modules'
import { z } from 'zod'
import type {
  ToolDefinition,
  TypeSafeToolDefinition,
  ZodObjectSchema,
} from './specs/LanguageModelSession.nitro'

/**
 * Converts a Zod schema to an AnyMap format that the native code can understand
 */
function zodSchemaToAnyMap(schema: z.ZodObject<any>): AnyMap {
  const anyMap = new Map<string, any>()

  const shape = schema.shape

  for (const [key, zodType] of Object.entries(shape)) {
    const type = getZodTypeString(zodType as z.ZodTypeAny)
    anyMap.set(key, type)
  }

  // Convert Map to plain object and then to AnyMap
  return Object.fromEntries(anyMap) as AnyMap
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
  return {
    name: definition.name,
    description: definition.description,
    arguments: zodSchemaToAnyMap(definition.arguments),
    implementation: async (args: AnyMap) => {
      // Parse and validate the arguments using Zod
      const parsedArgs = definition.arguments.parse(args)

      // Call the type-safe implementation
      const result = await definition.implementation(parsedArgs)

      // Return the result (convert to AnyMap if needed)
      return result as AnyMap
    },
  }
}
