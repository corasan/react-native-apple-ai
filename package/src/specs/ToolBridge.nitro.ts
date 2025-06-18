import type { HybridObject } from 'react-native-nitro-modules'

export interface ToolBridge extends HybridObject<{ ios: 'swift' }> {
  registerJSFunction(name: string, implementation: () => void): Promise<void>
  callJSFunction(functionName: string, args: Record<string, string>): Promise<void>
}
