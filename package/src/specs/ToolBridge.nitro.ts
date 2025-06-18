import type { AnyMap, HybridObject } from 'react-native-nitro-modules'

export interface ToolBridge extends HybridObject<{ ios: 'swift' }> {
  registerJSFunction(name: string, implementation: () => AnyMap): void
  // callJSFunction(functionName: string, args: Record<string, string>): void
}
