import type { AnyMap, HybridObject } from 'react-native-nitro-modules'
import type { Tool } from './Tool.nitro'

type ToolAction = (params: AnyMap) => Promise<AnyMap>

interface ToolConfig {
  name: string
  description: string
  arguments: AnyMap
  call: ToolAction
}

export interface ToolFactory extends HybridObject<{ ios: 'swift' }> {
  create(config: ToolConfig): Tool
}
