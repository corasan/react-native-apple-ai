import type { AnyMap, HybridObject } from 'react-native-nitro-modules'

export interface ToolBridge extends HybridObject<{ ios: 'swift' }> {
  registerJSFunction(
    name: string,
    implementation: (args: AnyMap) => Promise<AnyMap>,
  ): void
}
