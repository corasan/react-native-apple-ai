import { NitroModules } from 'react-native-nitro-modules'
import type { FoundationModels as FoundationModelsSpec } from './specs/FoundationModels.nitro'
import type { ToolBridge as ToolBridgeSpec } from './specs/ToolBridge.nitro'

export const FoundationModels =
  NitroModules.createHybridObject<FoundationModelsSpec>('FoundationModels')
export const ToolBridge = NitroModules.createHybridObject<ToolBridgeSpec>('ToolBridge')

export * from './types'
