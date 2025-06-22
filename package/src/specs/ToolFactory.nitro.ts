import type { AnyMap, HybridObject } from 'react-native-nitro-modules'

interface ToolAction {
  (params: AnyMap): Promise<AnyMap>
}

interface ToolConfig {
  name: string
  description: string
  arguments: AnyMap
  call: ToolAction
}

interface HybridTool {
  readonly name: string
  readonly description: string
  readonly arguments: AnyMap
}

export interface ToolFactory extends HybridObject<{ ios: 'swift' }> {
  create(config: ToolConfig): HybridTool
}
