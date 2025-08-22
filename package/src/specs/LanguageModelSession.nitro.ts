import type { AnyMap, HybridObject } from 'react-native-nitro-modules'
import type { z } from 'zod'

export type ZodObjectSchema = z.ZodObject<any>

export type InferArgs<T extends ZodObjectSchema> = z.infer<T>

export interface TypeSafeToolDefinition<T extends ZodObjectSchema> {
  name: string
  description: string
  arguments: T
  implementation: (args: InferArgs<T>) => Promise<AnyMap>
}

export interface ToolDefinition {
  name: string
  description: string
  arguments: AnyMap
  implementation: (args: AnyMap) => Promise<AnyMap>
}

export interface LanguageModelSessionConfig {
  instructions?: string
  tools?: Array<ToolDefinition>
}

export interface LanguageModelSession extends HybridObject<{ ios: 'swift' }> {
  streamResponse(prompt: string, onStream: (stream: string) => void): Promise<string>
  readonly wasContextReset: boolean
}

export interface LanguageModelSessionFactory extends HybridObject<{ ios: 'swift' }> {
  create(config: LanguageModelSessionConfig): LanguageModelSession
}
