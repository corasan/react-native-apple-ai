import { NitroModules } from 'react-native-nitro-modules'
import type { FoundationModels as FoundationModelsSpec } from './specs/FoundationModels.nitro'
// import type { Tool as ToolSpec } from './specs/Tool.nitro'
import type { ToolBridge as ToolBridgeSpec } from './specs/ToolBridge.nitro'
import type { ToolFactory as ToolFactorySpec } from './specs/ToolFactory.nitro'
export { LanguageModelSession } from './LanguageModelSession'
export const FoundationModels =
  NitroModules.createHybridObject<FoundationModelsSpec>('FoundationModels')
export const ToolBridge = NitroModules.createHybridObject<ToolBridgeSpec>('ToolBridge')
export const ToolFactory = NitroModules.createHybridObject<ToolFactorySpec>('ToolFactory')


export * from './types'
